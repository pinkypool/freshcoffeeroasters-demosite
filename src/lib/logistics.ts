export const TEEZ_CITIES_LIST = [
    'Астана',
    'Алматы',
    'Караганда',
    'Шымкент',
    'Рудный',
    'Аксу',
    'Актау',
    'Актобе',
    'Атырау',
    'Балхаш',
    'Жанаозен',
    'Жезказган',
    'Кентау',
    'Кокшетау',
    'Конаев',
    'Костанай',
    'Кульсары',
    'Кызылорда',
    'Павлодар',
    'Петропавловск',
    'Сатпаев',
    'Семей',
    'Талдыкорган',
    'Тараз',
    'Темиртау',
    'Уральск',
    'Усть-Каменогорск',
    'Щучинск',
    'Экибастуз',
];

export const COURIER_ONLY_CITIES = ['Каскелен', 'Талгар', 'Туркестан'];

export interface PickupPoint {
    id: string;
    city: string;
    address: string;
    coordinates?: [number, number];
}

// Placeholder pickup points for all Teez cities
// TODO: Replace with actual addresses from Teez
export const PICKUP_POINTS: PickupPoint[] = [
    // Астана
    { id: 'astana-1', city: 'Астана', address: 'ПВЗ Teez, ул. Мәңгілік Ел, 1' },
    { id: 'astana-2', city: 'Астана', address: 'ПВЗ Teez, ул. Сарыарка, 15' },
    // Алматы
    { id: 'almaty-1', city: 'Алматы', address: 'ПВЗ Teez, ул. Абая, 52' },
    { id: 'almaty-2', city: 'Алматы', address: 'ПВЗ Teez, ул. Толе би, 100' },
    { id: 'almaty-3', city: 'Алматы', address: 'ПВЗ Teez, мкр. Самал-2, 33' },
    // Караганда
    { id: 'karaganda-1', city: 'Караганда', address: 'ПВЗ Teez, ул. Бухар-Жырау, 64' },
    // Шымкент
    { id: 'shymkent-1', city: 'Шымкент', address: 'ПВЗ Teez, ул. Тауке хана, 21' },
    // Актобе
    { id: 'aktobe-1', city: 'Актобе', address: 'ПВЗ Teez, ул. Санкибай батыра, 158' },
    // Атырау
    { id: 'atyrau-1', city: 'Атырау', address: 'ПВЗ Teez, ул. Сатпаева, 45' },
    // Павлодар
    { id: 'pavlodar-1', city: 'Павлодар', address: 'ПВЗ Teez, ул. 1 Мая, 12' },
    // Костанай
    { id: 'kostanay-1', city: 'Костанай', address: 'ПВЗ Teez, ул. Баймагамбетова, 89' },
    // Уральск
    { id: 'uralsk-1', city: 'Уральск', address: 'ПВЗ Teez, ул. Достык, 50' },
    // Семей
    { id: 'semey-1', city: 'Семей', address: 'ПВЗ Teez, пр. Шакарима, 75' },
    // Тараз
    { id: 'taraz-1', city: 'Тараз', address: 'ПВЗ Teez, ул. Толе би, 31' },
    // Кокшетау
    { id: 'kokshetau-1', city: 'Кокшетау', address: 'ПВЗ Teez, ул. Ауэзова, 10' },
    // Петропавловск
    { id: 'petropavlovsk-1', city: 'Петропавловск', address: 'ПВЗ Teez, ул. Интернациональная, 44' },
    // Талдыкорган
    { id: 'taldykorgan-1', city: 'Талдыкорган', address: 'ПВЗ Teez, ул. Жансугурова, 82' },
    // Актау
    { id: 'aktau-1', city: 'Актау', address: 'ПВЗ Teez, мкр. 14, д. 55' },
    // Усть-Каменогорск
    { id: 'ust-kamenogorsk-1', city: 'Усть-Каменогорск', address: 'ПВЗ Teez, ул. Казахстан, 68' },
    // Кызылорда
    { id: 'kyzylorda-1', city: 'Кызылорда', address: 'ПВЗ Teez, ул. Желтоксан, 22' },
    // Балхаш
    { id: 'balkhash-1', city: 'Балхаш', address: 'ПВЗ Teez, ул. Алматинская, 5' },
    // Темиртау
    { id: 'temirtau-1', city: 'Темиртау', address: 'ПВЗ Teez, пр. Металлургов, 40' },
    // Экибастуз
    { id: 'ekibastuz-1', city: 'Экибастуз', address: 'ПВЗ Teez, ул. Мәшһүр Жүсіп, 17' },
    // Рудный
    { id: 'rudny-1', city: 'Рудный', address: 'ПВЗ Teez, ул. 50 лет Октября, 56' },
    // Жезказган
    { id: 'zhezkazgan-1', city: 'Жезказган', address: 'ПВЗ Teez, ул. Бейбітшілік, 33' },
    // Аксу
    { id: 'aksu-1', city: 'Аксу', address: 'ПВЗ Teez, ул. Мира, 18' },
    // Кентау
    { id: 'kentau-1', city: 'Кентау', address: 'ПВЗ Teez, ул. Шаруашылық, 4' },
    // Сатпаев
    { id: 'satpayev-1', city: 'Сатпаев', address: 'ПВЗ Teez, ул. Сатпаева, 60' },
    // Конаев
    { id: 'konaev-1', city: 'Конаев', address: 'ПВЗ Teez, ул. Назарбаева, 12' },
    // Жанаозен
    { id: 'zhanaozen-1', city: 'Жанаозен', address: 'ПВЗ Teez, мкр. 8, д. 7' },
    // Кульсары
    { id: 'kulsary-1', city: 'Кульсары', address: 'ПВЗ Teez, ул. Центральная, 3' },
    // Щучинск
    { id: 'shchuchinsk-1', city: 'Щучинск', address: 'ПВЗ Teez, ул. Абылай хана, 25' },
];

export type DeliveryMethodType = 'PICKUP_TEEZ' | 'COURIER' | 'MANAGER_CALCULATION';

export interface DeliveryOption {
    id: DeliveryMethodType;
    label: string;
    price: number | 'Free' | 'Calculated by manager';
}

export function getPickupPointsForCity(city: string): PickupPoint[] {
    return PICKUP_POINTS.filter((p) => p.city === city);
}

export function getDeliveryOptions(city: string): DeliveryOption[] {
    const options: DeliveryOption[] = [];

    // Check if city is in Teez list
    if (TEEZ_CITIES_LIST.includes(city)) {
        const pickupPoints = getPickupPointsForCity(city);
        if (pickupPoints.length > 0) {
            options.push({
                id: 'PICKUP_TEEZ',
                label: `Пункт выдачи Teez (${pickupPoints.length} адресов)`,
                price: 'Free',
            });
        }
    }

    // Always offer courier option
    options.push({
        id: 'COURIER',
        label: 'Курьер / Почта / Такси',
        price: 'Calculated by manager',
    });

    return options;
}
