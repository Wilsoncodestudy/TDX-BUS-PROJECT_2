/*import React from 'react';
import styles from './ModernCard.module.css';

export default function ModernCard({ title, children, footer }) {
  return (
    <div className={styles.card}>
      {title && <div className={styles.title}>{title}</div>}
      <div className={styles.content}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
}*/
import React from "react";

/**
 * ModernCard - A modern, glassmorphism-inspired card component.
 * Props:
 *   - title: string (optional)
 *   - children: ReactNode (main content)
 *   - footer: ReactNode (optional)
 */
export default function ModernCard({ title, children, footer }) {
  return (
    <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 p-6 transition-transform hover:scale-105 hover:shadow-2xl duration-200">
      {title && (
        <div className="text-xl font-semibold mb-2 text-gray-800">{title}</div>
      )}
      <div className="text-gray-700 mb-2">{children}</div>
      {footer && (
        <div className="mt-4 border-t border-gray-200 pt-2 text-sm text-gray-500">
          {footer}
        </div>
      )}
    </div>
  );
}
