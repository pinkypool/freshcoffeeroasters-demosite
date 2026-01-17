import React from 'react';
import styles from './Skeleton.module.css';

interface SkeletonProps {
    variant?: 'image' | 'text' | 'textShort' | 'title' | 'circle';
    className?: string;
    style?: React.CSSProperties;
}

export function Skeleton({ variant = 'text', className = '', style }: SkeletonProps) {
    const variantClass = {
        image: styles.skeletonImage,
        text: styles.skeletonText,
        textShort: styles.skeletonTextShort,
        title: styles.skeletonTitle,
        circle: styles.skeletonCircle,
    }[variant];

    return (
        <div
            className={`${styles.skeleton} ${variantClass} ${className}`}
            style={style}
        />
    );
}

export function ModelLoader() {
    return (
        <div className={styles.modelLoader}>
            <div className={styles.modelSpinner} />
            <span className={styles.modelLoaderText}>Загружаем 3D модель...</span>
        </div>
    );
}

export default Skeleton;
