import React from "react";
import { IoSearchOutline, IoTrashOutline, IoAddOutline } from "react-icons/io5";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";

/**
 * Shared premium page wrapper with search, action buttons, table container, and pagination.
 * Used by all catalog/module pages.
 */
export const PageShell = ({
  children,
  search,
  onSearchChange,
  searchPlaceholder = "Buscar...",
  onNew,
  newLabel = "Nuevo",
  selectedCount = 0,
  onDeleteSelected,
  isDeleting = false,
  extraActions,
}) => (
  <div className="p-6 md:p-8 animate-fade-in-up">
    {/* Toolbar */}
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
      {/* Left: action buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        {onNew && (
          <button
            onClick={onNew}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #1e3a5f, #2a5298)",
              boxShadow: "0 4px 12px rgba(30,58,95,0.3)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 6px 16px rgba(30,58,95,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(30,58,95,0.3)";
            }}
          >
            <IoAddOutline className="w-5 h-5" />
            {newLabel}
          </button>
        )}

        {selectedCount > 0 && onDeleteSelected && (
          <button
            onClick={onDeleteSelected}
            disabled={isDeleting}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #dc2626, #b91c1c)",
              boxShadow: "0 4px 12px rgba(220,38,38,0.25)",
            }}
          >
            {isDeleting ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Eliminando...
              </>
            ) : (
              <>
                <IoTrashOutline className="w-4 h-4" />
                Eliminar ({selectedCount})
              </>
            )}
          </button>
        )}

        {extraActions}
      </div>

      {/* Right: search */}
      <div className="relative">
        <IoSearchOutline
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
          style={{ color: "var(--color-text-muted)" }}
        />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="pl-9 pr-4 py-2.5 rounded-xl text-sm w-full sm:w-72 focus:outline-none transition-all"
          style={{
            border: "1.5px solid var(--color-border)",
            background: "white",
            color: "var(--color-text-primary)",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "var(--brand-primary)";
            e.target.style.boxShadow = "0 0 0 3px rgba(30,58,95,0.1)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "var(--color-border)";
            e.target.style.boxShadow = "none";
          }}
        />
      </div>
    </div>

    {/* Table card */}
    <div
      className="rounded-2xl overflow-hidden border"
      style={{
        background: "white",
        borderColor: "var(--color-border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {children}
    </div>
  </div>
);

/**
 * Premium pagination component
 */
export const Pagination = ({ page, totalPages, totalItems, pageSize, onPageChange }) => {
  if (totalPages <= 1) return null;
  const desde = (page - 1) * pageSize + 1;
  const hasta = Math.min(page * pageSize, totalItems);

  return (
    <div
      className="flex items-center justify-between px-6 py-3 border-t"
      style={{ borderColor: "var(--color-border)", background: "var(--color-surface-2)" }}
    >
      <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
        Mostrando {totalItems === 0 ? 0 : desde}–{hasta} de {totalItems}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="p-1.5 rounded-lg border transition-colors disabled:opacity-40"
          style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}
        >
          <HiOutlineChevronLeft className="w-4 h-4" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
          .reduce((acc, n, idx, arr) => {
            if (idx > 0 && arr[idx - 1] !== n - 1) acc.push("...");
            acc.push(n);
            return acc;
          }, [])
          .map((item, idx) =>
            item === "..." ? (
              <span key={`dots-${idx}`} className="px-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
                …
              </span>
            ) : (
              <button
                key={item}
                onClick={() => onPageChange(item)}
                className="w-8 h-8 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: page === item ? "var(--brand-primary)" : "transparent",
                  color: page === item ? "white" : "var(--color-text-secondary)",
                  border: page === item ? "none" : "1px solid var(--color-border)",
                }}
              >
                {item}
              </button>
            )
          )}

        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="p-1.5 rounded-lg border transition-colors disabled:opacity-40"
          style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}
        >
          <HiOutlineChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

/**
 * Empty state component
 */
export const EmptyState = ({ icon: Icon, message = "No hay datos para mostrar.", filtered = false }) => (
  <div className="flex flex-col items-center justify-center py-16">
    {Icon && (
      <Icon className="w-10 h-10 mb-3 opacity-30" style={{ color: "var(--color-text-muted)" }} />
    )}
    <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
      {filtered ? "Sin resultados para tu búsqueda." : message}
    </p>
  </div>
);

/**
 * Table loading skeleton
 */
export const TableLoader = () => (
  <div className="flex flex-col items-center justify-center py-16 gap-3">
    <svg className="animate-spin w-8 h-8" viewBox="0 0 24 24" fill="none" style={{ color: "var(--brand-primary)" }}>
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
    <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>Cargando datos...</span>
  </div>
);

/**
 * Simple inline modal (overlay).
 */
export const SimpleModal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "var(--color-border)" }}
        >
          <h3 className="font-semibold text-base" style={{ color: "var(--color-text-primary)" }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg transition-colors"
            style={{ color: "var(--color-text-muted)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--color-surface-2)";
              e.currentTarget.style.color = "var(--color-text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--color-text-muted)";
            }}
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        {/* Body */}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
};

/**
 * Premium form input
 */
export const FormInput = ({ label, id, ...props }) => (
  <div>
    {label && (
      <label
        htmlFor={id}
        className="block text-sm font-medium mb-1.5"
        style={{ color: "var(--color-text-primary)" }}
      >
        {label}
      </label>
    )}
    <input
      id={id}
      {...props}
      className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none transition-all"
      style={{
        border: "1.5px solid var(--color-border)",
        background: "var(--color-surface-2)",
        color: "var(--color-text-primary)",
        ...props.style,
      }}
      onFocus={(e) => {
        e.target.style.borderColor = "var(--brand-primary)";
        e.target.style.boxShadow = "0 0 0 3px rgba(30,58,95,0.1)";
        e.target.style.background = "white";
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.target.style.borderColor = "var(--color-border)";
        e.target.style.boxShadow = "none";
        e.target.style.background = "var(--color-surface-2)";
        props.onBlur?.(e);
      }}
    />
  </div>
);

/**
 * Primary action button
 */
export const PrimaryButton = ({ children, loading, className = "", style = {}, ...props }) => (
  <button
    {...props}
    disabled={props.disabled || loading}
    className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    style={{
      background: "linear-gradient(135deg, #1e3a5f, #2a5298)",
      boxShadow: "0 4px 12px rgba(30,58,95,0.3)",
      ...style,
    }}
    onMouseEnter={(e) => {
      if (!e.currentTarget.disabled) {
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow = "0 6px 16px rgba(30,58,95,0.4)";
      }
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 4px 12px rgba(30,58,95,0.3)";
    }}
  >
    {loading ? (
      <>
        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        Guardando...
      </>
    ) : children}
  </button>
);

/**
 * Edit inline button
 */
export const EditButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
    style={{ color: "var(--brand-primary-light)", background: "rgba(42,82,152,0.08)" }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = "rgba(42,82,152,0.15)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "rgba(42,82,152,0.08)";
    }}
  >
    <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
    </svg>
    Editar
  </button>
);
