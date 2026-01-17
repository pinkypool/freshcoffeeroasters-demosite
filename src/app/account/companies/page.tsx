'use client';

import React, { useState } from 'react';
import { useAuth, Company } from '@/context/AuthContext';
import styles from '../account.module.css';
import companyStyles from './companies.module.css';
import { Icons } from '@/components/Icons';

import { useSettings } from '@/context/SettingsContext';

export default function CompaniesPage() {
    const { user, addCompany, updateCompany, deleteCompany, setDefaultCompany } = useAuth();
    const { language } = useSettings();
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

    const content = {
        ru: {
            title: 'Мои компании',
            addBtn: 'Добавить компанию',
            empty: {
                title: 'Нет сохранённых компаний',
                text: 'Добавьте реквизиты компании для быстрого оформления заказов',
                btn: 'Добавить первую компанию',
            },
            card: {
                default: 'По умолчанию',
                bin: 'БИН/ИИН:',
                legal: 'Юр. адрес:',
                delivery: 'Адрес доставки:',
                contact: 'Контактное лицо:',
                phone: 'Телефон:',
                makeDefault: 'Сделать основной',
                edit: 'Редактировать',
                delete: 'Удалить',
                deleteConfirm: 'Удалить эту компанию?',
            },
            form: {
                titleNew: 'Новая компания',
                titleEdit: 'Редактировать компанию',
                name: 'Название компании *',
                namePlaceholder: 'ТОО "Название" или ИП Иванов',
                bin: 'БИН / ИИН *',
                binPlaceholder: '123456789012',
                legal: 'Юридический адрес *',
                legalPlaceholder: 'г. Алматы, ул. Абая 150',
                delivery: 'Адрес доставки',
                deliveryPlaceholder: 'Совпадает с юр. адресом или укажите другой',
                contact: 'Контактное лицо *',
                contactPlaceholder: 'Иванов Иван',
                phone: 'Телефон *',
                phonePlaceholder: '+7 777 123 45 67',
                cancel: 'Отмена',
                save: 'Сохранить',
                add: 'Добавить',
            }
        },
        en: {
            title: 'My Companies',
            addBtn: 'Add Company',
            empty: {
                title: 'No saved companies',
                text: 'Add company details for quick checkout',
                btn: 'Add First Company',
            },
            card: {
                default: 'Default',
                bin: 'BIN/IIN:',
                legal: 'Legal Address:',
                delivery: 'Delivery Address:',
                contact: 'Contact Person:',
                phone: 'Phone:',
                makeDefault: 'Make Default',
                edit: 'Edit',
                delete: 'Delete',
                deleteConfirm: 'Delete this company?',
            },
            form: {
                titleNew: 'New Company',
                titleEdit: 'Edit Company',
                name: 'Company Name *',
                namePlaceholder: 'LLC "Company Name"',
                bin: 'BIN / IIN *',
                binPlaceholder: '123456789012',
                legal: 'Legal Address *',
                legalPlaceholder: 'Almaty, Abay ave. 150',
                delivery: 'Delivery Address',
                deliveryPlaceholder: 'Same as legal or specify other',
                contact: 'Contact Person *',
                contactPlaceholder: 'John Doe',
                phone: 'Phone *',
                phonePlaceholder: '+7 777 123 45 67',
                cancel: 'Cancel',
                save: 'Save',
                add: 'Add',
            }
        },
    };

    const t = content[language];

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
        if (confirm(t.card.deleteConfirm)) {
            deleteCompany(id);
        }
    };

    const companies = user?.companies || [];

    return (
        <div className={styles.pageContent}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>{t.title}</h1>
                <button
                    className={companyStyles.addBtn}
                    onClick={() => { resetForm(); setIsFormOpen(true); }}
                >
                    <Icons.Package size={18} />
                    {t.addBtn}
                </button>
            </div>

            {companies.length === 0 ? (
                <div className={companyStyles.emptyState}>
                    <Icons.Office size={48} />
                    <h3>{t.empty.title}</h3>
                    <p>{t.empty.text}</p>
                    <button
                        className={companyStyles.addBtnLarge}
                        onClick={() => setIsFormOpen(true)}
                    >
                        {t.empty.btn}
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
                                    {t.card.default}
                                </div>
                            )}
                            <h3 className={companyStyles.companyName}>{company.name}</h3>
                            <div className={companyStyles.companyInfo}>
                                <div className={companyStyles.infoRow}>
                                    <span className={companyStyles.label}>{t.card.bin}</span>
                                    <span>{company.bin}</span>
                                </div>
                                <div className={companyStyles.infoRow}>
                                    <span className={companyStyles.label}>{t.card.legal}</span>
                                    <span>{company.legalAddress}</span>
                                </div>
                                <div className={companyStyles.infoRow}>
                                    <span className={companyStyles.label}>{t.card.delivery}</span>
                                    <span>{company.deliveryAddress}</span>
                                </div>
                                <div className={companyStyles.infoRow}>
                                    <span className={companyStyles.label}>{t.card.contact}</span>
                                    <span>{company.contactPerson}</span>
                                </div>
                                <div className={companyStyles.infoRow}>
                                    <span className={companyStyles.label}>{t.card.phone}</span>
                                    <span>{company.contactPhone}</span>
                                </div>
                            </div>
                            <div className={companyStyles.cardActions}>
                                {!company.isDefault && (
                                    <button
                                        className={companyStyles.actionBtn}
                                        onClick={() => setDefaultCompany(company.id)}
                                    >
                                        {t.card.makeDefault}
                                    </button>
                                )}
                                <button
                                    className={companyStyles.actionBtnIcon}
                                    onClick={() => handleEdit(company)}
                                    title={t.card.edit}
                                >
                                    <Icons.Edit size={16} />
                                </button>
                                <button
                                    className={`${companyStyles.actionBtnIcon} ${companyStyles.danger}`}
                                    onClick={() => handleDelete(company.id)}
                                    title={t.card.delete}
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
                            <h2>{editingCompany ? t.form.titleEdit : t.form.titleNew}</h2>
                            <button
                                className={companyStyles.closeBtn}
                                onClick={() => setIsFormOpen(false)}
                            >
                                <Icons.Close size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className={companyStyles.form}>
                            <div className={companyStyles.formGroup}>
                                <label>{t.form.name}</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder={t.form.namePlaceholder}
                                    required
                                />
                            </div>
                            <div className={companyStyles.formGroup}>
                                <label>{t.form.bin}</label>
                                <input
                                    type="text"
                                    value={formData.bin}
                                    onChange={(e) => setFormData({ ...formData, bin: e.target.value })}
                                    placeholder={t.form.binPlaceholder}
                                    required
                                />
                            </div>
                            <div className={companyStyles.formGroup}>
                                <label>{t.form.legal}</label>
                                <input
                                    type="text"
                                    value={formData.legalAddress}
                                    onChange={(e) => setFormData({ ...formData, legalAddress: e.target.value })}
                                    placeholder={t.form.legalPlaceholder}
                                    required
                                />
                            </div>
                            <div className={companyStyles.formGroup}>
                                <label>{t.form.delivery}</label>
                                <input
                                    type="text"
                                    value={formData.deliveryAddress}
                                    onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                                    placeholder={t.form.deliveryPlaceholder}
                                />
                            </div>
                            <div className={companyStyles.formRow}>
                                <div className={companyStyles.formGroup}>
                                    <label>{t.form.contact}</label>
                                    <input
                                        type="text"
                                        value={formData.contactPerson}
                                        onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                                        placeholder={t.form.contactPlaceholder}
                                        required
                                    />
                                </div>
                                <div className={companyStyles.formGroup}>
                                    <label>{t.form.phone}</label>
                                    <input
                                        type="tel"
                                        value={formData.contactPhone}
                                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                                        placeholder={t.form.phonePlaceholder}
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
                                    {t.form.cancel}
                                </button>
                                <button type="submit" className={companyStyles.submitBtn}>
                                    {editingCompany ? t.form.save : t.form.add}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
