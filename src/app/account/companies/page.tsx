'use client';

import React, { useState } from 'react';
import { useAuth, Company } from '@/context/AuthContext';
import styles from '../account.module.css';
import companyStyles from './companies.module.css';
import { Icons } from '@/components/Icons';

export default function CompaniesPage() {
    const { user, addCompany, updateCompany, deleteCompany, setDefaultCompany } = useAuth();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCompany, setEditingCompany] = useState<Company | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        bin: '',
        legalAddress: '',
        deliveryAddress: '',
        contactPerson: '',
        contactPhone: '',
    });

    const resetForm = () => {
        setFormData({
            name: '',
            bin: '',
            legalAddress: '',
            deliveryAddress: '',
            contactPerson: '',
            contactPhone: '',
        });
        setEditingCompany(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCompany) {
            updateCompany(editingCompany.id, formData);
        } else {
            addCompany({ ...formData, isDefault: false });
        }
        setIsFormOpen(false);
        resetForm();
    };

    const handleEdit = (company: Company) => {
        setFormData({
            name: company.name,
            bin: company.bin,
            legalAddress: company.legalAddress,
            deliveryAddress: company.deliveryAddress,
            contactPerson: company.contactPerson,
            contactPhone: company.contactPhone,
        });
        setEditingCompany(company);
        setIsFormOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('Удалить эту компанию?')) {
            deleteCompany(id);
        }
    };

    const companies = user?.companies || [];

    return (
        <div className={styles.pageContent}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Мои компании</h1>
                <button
                    className={companyStyles.addBtn}
                    onClick={() => { resetForm(); setIsFormOpen(true); }}
                >
                    <Icons.Package size={18} />
                    Добавить компанию
                </button>
            </div>

            {companies.length === 0 ? (
                <div className={companyStyles.emptyState}>
                    <Icons.Office size={48} />
                    <h3>Нет сохранённых компаний</h3>
                    <p>Добавьте реквизиты компании для быстрого оформления заказов</p>
                    <button
                        className={companyStyles.addBtnLarge}
                        onClick={() => setIsFormOpen(true)}
                    >
                        Добавить первую компанию
                    </button>
                </div>
            ) : (
                <div className={companyStyles.companiesGrid}>
                    {companies.map((company) => (
                        <div
                            key={company.id}
                            className={`${companyStyles.companyCard} ${company.isDefault ? companyStyles.isDefault : ''}`}
                        >
                            {company.isDefault && (
                                <div className={companyStyles.defaultBadge}>
                                    <Icons.Check size={14} />
                                    По умолчанию
                                </div>
                            )}
                            <h3 className={companyStyles.companyName}>{company.name}</h3>
                            <div className={companyStyles.companyInfo}>
                                <div className={companyStyles.infoRow}>
                                    <span className={companyStyles.label}>БИН/ИИН:</span>
                                    <span>{company.bin}</span>
                                </div>
                                <div className={companyStyles.infoRow}>
                                    <span className={companyStyles.label}>Юр. адрес:</span>
                                    <span>{company.legalAddress}</span>
                                </div>
                                <div className={companyStyles.infoRow}>
                                    <span className={companyStyles.label}>Адрес доставки:</span>
                                    <span>{company.deliveryAddress}</span>
                                </div>
                                <div className={companyStyles.infoRow}>
                                    <span className={companyStyles.label}>Контактное лицо:</span>
                                    <span>{company.contactPerson}</span>
                                </div>
                                <div className={companyStyles.infoRow}>
                                    <span className={companyStyles.label}>Телефон:</span>
                                    <span>{company.contactPhone}</span>
                                </div>
                            </div>
                            <div className={companyStyles.cardActions}>
                                {!company.isDefault && (
                                    <button
                                        className={companyStyles.actionBtn}
                                        onClick={() => setDefaultCompany(company.id)}
                                    >
                                        Сделать основной
                                    </button>
                                )}
                                <button
                                    className={companyStyles.actionBtnIcon}
                                    onClick={() => handleEdit(company)}
                                    title="Редактировать"
                                >
                                    <Icons.Edit size={16} />
                                </button>
                                <button
                                    className={`${companyStyles.actionBtnIcon} ${companyStyles.danger}`}
                                    onClick={() => handleDelete(company.id)}
                                    title="Удалить"
                                >
                                    <Icons.Close size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Form Modal */}
            {isFormOpen && (
                <div className={companyStyles.modalOverlay} onClick={() => setIsFormOpen(false)}>
                    <div className={companyStyles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={companyStyles.modalHeader}>
                            <h2>{editingCompany ? 'Редактировать компанию' : 'Новая компания'}</h2>
                            <button
                                className={companyStyles.closeBtn}
                                onClick={() => setIsFormOpen(false)}
                            >
                                <Icons.Close size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className={companyStyles.form}>
                            <div className={companyStyles.formGroup}>
                                <label>Название компании *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder='ТОО "Название" или ИП Иванов'
                                    required
                                />
                            </div>
                            <div className={companyStyles.formGroup}>
                                <label>БИН / ИИН *</label>
                                <input
                                    type="text"
                                    value={formData.bin}
                                    onChange={(e) => setFormData({ ...formData, bin: e.target.value })}
                                    placeholder="123456789012"
                                    required
                                />
                            </div>
                            <div className={companyStyles.formGroup}>
                                <label>Юридический адрес *</label>
                                <input
                                    type="text"
                                    value={formData.legalAddress}
                                    onChange={(e) => setFormData({ ...formData, legalAddress: e.target.value })}
                                    placeholder="г. Алматы, ул. Абая 150"
                                    required
                                />
                            </div>
                            <div className={companyStyles.formGroup}>
                                <label>Адрес доставки</label>
                                <input
                                    type="text"
                                    value={formData.deliveryAddress}
                                    onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                                    placeholder="Совпадает с юр. адресом или укажите другой"
                                />
                            </div>
                            <div className={companyStyles.formRow}>
                                <div className={companyStyles.formGroup}>
                                    <label>Контактное лицо *</label>
                                    <input
                                        type="text"
                                        value={formData.contactPerson}
                                        onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                                        placeholder="Иванов Иван"
                                        required
                                    />
                                </div>
                                <div className={companyStyles.formGroup}>
                                    <label>Телефон *</label>
                                    <input
                                        type="tel"
                                        value={formData.contactPhone}
                                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                                        placeholder="+7 777 123 45 67"
                                        required
                                    />
                                </div>
                            </div>
                            <div className={companyStyles.formActions}>
                                <button
                                    type="button"
                                    className={companyStyles.cancelBtn}
                                    onClick={() => setIsFormOpen(false)}
                                >
                                    Отмена
                                </button>
                                <button type="submit" className={companyStyles.submitBtn}>
                                    {editingCompany ? 'Сохранить' : 'Добавить'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
