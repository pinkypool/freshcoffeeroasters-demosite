// Icon library using react-icons
// This centralizes all icons  for consistency

import {
    FiUser,
    FiPhone,
    FiMail,
    FiMapPin,
    FiTruck,
    FiPackage,
    FiCreditCard,
    FiDollarSign,
    FiCheckCircle,
    FiShoppingCart,
    FiHome,
    FiUsers,
    FiStar,
    FiAward,
    FiCoffee,
    FiMessageCircle,
    FiBook,
    FiSettings,
    FiGift,
    FiSearch,
    FiPercent,
    FiClock,
    FiCalendar,
    FiHeart,
    FiThumbsUp,
    FiArrowRight,
    FiArrowLeft,
    FiChevronDown,
    FiChevronUp,
    FiMenu,
    FiX,
    FiInfo,
    FiAlertCircle,
    FiAlertTriangle,
    FiFileText,
    FiDownload,
    FiRepeat,
    FiLogOut,
    FiGrid,
    FiEye,
    FiEdit,
    FiChevronRight,
    FiLock,
    FiBell,
    FiSun,
    FiMoon,
} from 'react-icons/fi';

import {
    HiOutlineOfficeBuilding,
    HiOutlineHome,
    HiOutlineLightBulb,
    HiOutlineSparkles,
    HiOutlineAcademicCap,
    HiOutlineUserGroup,
    HiOutlineCurrencyDollar,
    HiOutlineShieldCheck,
    HiOutlineTruck,
    HiOutlineGift,
    HiOutlineCog,
    HiOutlineBadgeCheck,
} from 'react-icons/hi';

import {
    BiLeaf,
    BiCoffeeTogo,
} from 'react-icons/bi';

import {
    FaInstagram,
    FaWhatsapp,
} from 'react-icons/fa';

import { CoffeeBeanLine } from './CoffeeBeanLine';

export const Icons = {
    // User & Contact
    User: FiUser,
    Phone: FiPhone,
    Mail: FiMail,
    Location: FiMapPin,
    Message: FiMessageCircle,

    // Delivery & Shipping
    Truck: FiTruck,
    Package: FiPackage,
    Delivery: HiOutlineTruck,

    // Payment
    Card: FiCreditCard,
    Dollar: FiDollarSign,
    Currency: HiOutlineCurrencyDollar,
    Percent: FiPercent,

    // Status
    Check: FiCheckCircle,
    Shield: HiOutlineShieldCheck,
    Badge: HiOutlineBadgeCheck,
    Star: FiStar,
    Award: FiAward,

    // Navigation
    Cart: FiShoppingCart,
    Home: FiHome,
    Menu: FiMenu,
    Close: FiX,
    ArrowRight: FiArrowRight,
    ArrowLeft: FiArrowLeft,
    ChevronDown: FiChevronDown,
    ChevronUp: FiChevronUp,

    // Business
    Office: HiOutlineOfficeBuilding,
    House: HiOutlineHome,
    Users: FiUsers,
    Team: HiOutlineUserGroup,

    // Coffee & Product
    Coffee: FiCoffee,
    CoffeeTogo: BiCoffeeTogo,
    Leaf: BiLeaf,
    Sparkles: HiOutlineSparkles,

    // Services
    Gift: FiGift,
    HiGift: HiOutlineGift,
    Settings: FiSettings,
    Cog: HiOutlineCog,
    Book: FiBook,
    Academy: HiOutlineAcademicCap,
    Lightbulb: HiOutlineLightBulb,

    // Other
    Search: FiSearch,
    Clock: FiClock,
    Calendar: FiCalendar,
    Heart: FiHeart,
    ThumbsUp: FiThumbsUp,

    // Auth & Account
    Info: FiInfo,
    AlertCircle: FiAlertCircle,
    Building: HiOutlineOfficeBuilding,
    FileText: FiFileText,
    Download: FiDownload,
    Repeat: FiRepeat,
    Logout: FiLogOut,
    Grid: FiGrid,
    Eye: FiEye,
    Edit: FiEdit,
    ChevronRight: FiChevronRight,
    Lock: FiLock,
    Bell: FiBell,
    Warning: FiAlertTriangle,
    Sun: FiSun,
    Moon: FiMoon,

    // Social Media
    Instagram: FaInstagram,
    WhatsApp: FaWhatsapp,

    // Custom
    CoffeeBeanLine: CoffeeBeanLine,
};

export type IconName = keyof typeof Icons;
