import { X } from "lucide-react";
import { useEffect, useRef } from "react";

export function Modal({ open, title, onClose, children }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog ref={dialogRef} className="modal" onClose={onClose} onClick={(event) => {
      if (event.target === event.currentTarget) onClose();
    }} aria-labelledby="modal-title">
      <div className="modal-header">
        <h2 id="modal-title">{title}</h2>
        <button className="icon-button" type="button" onClick={onClose} title="Fechar" aria-label="Fechar"><X size={18} /></button>
      </div>
      <div className="modal-body">{children}</div>
    </dialog>
  );
}
