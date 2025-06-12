import React from 'react';
import styles from './ModernCard.module.css';

export default function ModernCard({ title, children, footer }) {
  return (
    <div className={styles.card}>
      {title && <div className={styles.title}>{title}</div>}
      <div className={styles.content}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
}
