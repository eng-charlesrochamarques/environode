#include "stm32h7xx.h"

#include <stddef.h>
#include <stdint.h>

#include "telemetry_protocol.h"

#define UART_BAUD_RATE 115200U
#define TELEMETRY_INTERVAL_MS 2000U

static void uart3_init(void) {
  RCC->AHB4ENR |= RCC_AHB4ENR_GPIODEN;
  RCC->APB1LENR |= RCC_APB1LENR_USART3EN;
  (void)RCC->APB1LENR;

  GPIOD->MODER = (GPIOD->MODER & ~((3UL << GPIO_MODER_MODE8_Pos) |
                                    (3UL << GPIO_MODER_MODE9_Pos))) |
                   (2UL << GPIO_MODER_MODE8_Pos) |
                   (2UL << GPIO_MODER_MODE9_Pos);
  GPIOD->OTYPER &= ~((1UL << 8U) | (1UL << 9U));
  GPIOD->OSPEEDR |= (3UL << GPIO_OSPEEDR_OSPEED8_Pos) |
                    (3UL << GPIO_OSPEEDR_OSPEED9_Pos);
  GPIOD->PUPDR = (GPIOD->PUPDR & ~((3UL << GPIO_PUPDR_PUPD8_Pos) |
                                    (3UL << GPIO_PUPDR_PUPD9_Pos))) |
                  (1UL << GPIO_PUPDR_PUPD9_Pos);
  GPIOD->AFR[1] = (GPIOD->AFR[1] & ~((0xFUL << GPIO_AFRH_AFSEL8_Pos) |
                                      (0xFUL << GPIO_AFRH_AFSEL9_Pos))) |
                    (7UL << GPIO_AFRH_AFSEL8_Pos) |
                    (7UL << GPIO_AFRH_AFSEL9_Pos);

  USART3->CR1 = 0U;
  USART3->PRESC = 0U;
  USART3->BRR = (SystemD2Clock + (UART_BAUD_RATE / 2U)) / UART_BAUD_RATE;
  USART3->CR1 = USART_CR1_TE | USART_CR1_UE;
  while ((USART3->ISR & USART_ISR_TEACK) == 0U) {}
}

static void uart3_write(const char *data, size_t length) {
  for (size_t index = 0; index < length; index++) {
    while ((USART3->ISR & USART_ISR_TXE_TXFNF) == 0U) {}
    USART3->TDR = (uint8_t)data[index];
  }
  while ((USART3->ISR & USART_ISR_TC) == 0U) {}
}

static void delay_init(void) {
  SysTick->LOAD = (SystemCoreClock / 1000U) - 1U;
  SysTick->VAL = 0U;
  SysTick->CTRL = SysTick_CTRL_CLKSOURCE_Msk | SysTick_CTRL_ENABLE_Msk;
}

static void delay_ms(uint32_t milliseconds) {
  while (milliseconds-- > 0U) {
    while ((SysTick->CTRL & SysTick_CTRL_COUNTFLAG_Msk) == 0U) {}
  }
}

int main(void) {
  char payload[512];
  uint32_t sequence = 0U;

  uart3_init();
  delay_init();

  for (;;) {
    const int32_t wave = (int32_t)(sequence % 20U);
    const environode_reading_t readings[] = {
      {"sensor-novalab-01-t1", 22400 + (wave * 80)},
      {"sensor-novalab-01-h1", 54500 + (wave * 120)},
      {"sensor-novalab-01-t2", 23100 + (wave * 65)},
      {"sensor-novalab-01-h2", 52100 + (wave * 95)}
    };
    const int length = environode_telemetry_format(
      payload,
      sizeof(payload),
      NULL,
      0U,
      NULL,
      readings,
      sizeof(readings) / sizeof(readings[0])
    );

    if (length > 0) uart3_write(payload, (size_t)length);
    sequence++;
    delay_ms(TELEMETRY_INTERVAL_MS);
  }
}
