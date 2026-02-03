"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faThLarge,
    faWallet,
    faChartBar,
    faBullseye,
    faQuestionCircle,
    faCog,
    faCreditCard,
    faChevronDown
} from '@fortawesome/free-solid-svg-icons'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type MenuItem = { name: string; href: string; icon?: React.ReactNode };

const Menu = ({ children, items }: { children: React.ReactNode; items: MenuItem[] }) => {
    const [isOpened, setIsOpened] = useState(false);

    return (
        <div>
            <button
                className="w-full flex items-center justify-between text-gray-600 p-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 duration-150"
                onClick={() => setIsOpened((v) => !v)}
                aria-expanded={isOpened}
                aria-controls="submenu"
            >
                <div className="flex items-center gap-x-2">{children}</div>
                <FontAwesomeIcon icon={faChevronDown} className={`w-3 h-3 duration-150 ${isOpened ? "rotate-180" : ""}`} />
            </button>

            {isOpened && (
                <ul id="submenu" className="mx-4 px-2 border-l text-sm font-medium">
                    {items.map((item, idx) => (
                        <li key={idx}>
                            <Link
                                href={item.href}
                                className="flex items-center gap-x-2 text-gray-600 p-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 duration-150"
                            >
                                {item.icon ? <div className="text-gray-500">{item.icon}</div> : null}
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export function Sidebar({ className }: { className?: string }) {
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            let token = localStorage.getItem('auth_token');

            // Handle Google OAuth Redirect token (Prioritize fresh token from URL)
            const hash = window.location.hash;
            if (hash && hash.includes('access_token')) {
                const params = new URLSearchParams(hash.replace('#', '?'));
                const accessToken = params.get('access_token');
                if (accessToken) {
                    token = accessToken;
                    localStorage.setItem('auth_token', accessToken);
                }
            }

            if (token) {
                try {
                    // Start by checking if we have stored basic details from signup
                    const localName = localStorage.getItem('signup_name');
                    const localEmail = localStorage.getItem('signup_email');

                    // Then try to fetch full profile
                    const { UpiService } = await import('@/services/upi.service');
                    const profile = await UpiService.getProfile(token);

                    setUser({
                        name: profile.name || localName || 'User',
                        email: profile.email || localEmail || 'user@example.com',
                        ...profile
                    });
                } catch (error) {
                    console.error("Failed to fetch sidebar profile", error);
                }
            }
        };
        fetchProfile();
    }, []);

    const navigation: MenuItem[] = [
        {
            href: "/dashboard",
            name: "Overview",
            icon: <FontAwesomeIcon icon={faThLarge} className="w-5 h-5" />,
        },
        {
            href: "/dashboard/goals",
            name: "My Goals",
            icon: <FontAwesomeIcon icon={faBullseye} className="w-5 h-5" />,
        },
        {
            href: "/dashboard/wallet",
            name: "Wallet",
            icon: <FontAwesomeIcon icon={faWallet} className="w-5 h-5" />,
        },
        {
            href: "/dashboard/activity",
            name: "Activity",
            icon: <FontAwesomeIcon icon={faChartBar} className="w-5 h-5" />,
        },
    ];

    const navsFooter: MenuItem[] = [
        {
            href: "/dashboard/help",
            name: "Help",
            icon: <FontAwesomeIcon icon={faQuestionCircle} className="w-5 h-5" />,
        },
        {
            href: "/dashboard/settings",
            name: "Settings",
            icon: <FontAwesomeIcon icon={faCog} className="w-5 h-5" />,
        },
    ];



    const profileRef = useRef<HTMLButtonElement | null>(null);
    const [isProfileActive, setIsProfileActive] = useState(false);

    useEffect(() => {
        const handleProfile = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
                setIsProfileActive(false);
            }
        };
        document.addEventListener("click", handleProfile);
        return () => document.removeEventListener("click", handleProfile);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 w-[260px] h-full border-r border-gray-200 bg-white ${className || ''}`}>
            <div className="flex flex-col h-full px-3">
                {/* Header Profile Section */}
                <div className="h-20 flex items-center justify-between pl-2 pr-4">
                    <div
                        ref={profileRef as any}
                        className="flex-1 flex items-center gap-x-4 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors relative"
                        onClick={() => setIsProfileActive(!isProfileActive)}
                    >
                        <Avatar className="w-10 h-10">
                            <AvatarImage src={user?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'User'}`} />
                            <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden">
                            <span className="block text-gray-700 text-sm font-semibold truncate">{user?.name || 'User'}</span>
                            <span className="block mt-px text-gray-600 text-xs truncate">{user?.email || 'user@example.com'}</span>
                        </div>
                    </div>



                    {/* Profile Dropdown */}
                    {isProfileActive && (
                        <div
                            id="profile-menu"
                            role="menu"
                            className="absolute z-50 left-2 top-20 mt-1 w-[240px] rounded-lg bg-white shadow-lg border text-sm text-gray-600"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-2 text-left">
                                <span className="block text-gray-500/80 p-2">{user?.email || 'user@example.com'}</span>
                                <Link
                                    href="/dashboard/account"
                                    className="block w-full p-2 text-left rounded-md hover:bg-gray-50 active:bg-gray-100 duration-150"
                                    role="menuitem"
                                    onClick={() => setIsProfileActive(false)}
                                >
                                    My Account
                                </Link>
                                <button
                                    className="block w-full p-2 text-left rounded-md hover:bg-gray-50 active:bg-gray-100 duration-150"
                                    onClick={() => {
                                        localStorage.removeItem('auth_token');
                                        window.location.href = '/auth/login';
                                    }}
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation Links */}
                <div className="overflow-auto flex-1 py-4">
                    <ul className="text-sm font-medium space-y-2">
                        {navigation.map((item, idx) => (
                            <li key={idx}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-x-2 p-2 rounded-lg duration-150 ${pathname === item.href
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-600 hover:bg-gray-50 active:bg-gray-100"
                                        }`}
                                >
                                    <div className="text-gray-500">{item.icon}</div>
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Footer Links */}
                <div className="py-4 border-t mt-auto">
                    <ul className="text-sm font-medium space-y-2">
                        {navsFooter.map((item, idx) => (
                            <li key={idx}>
                                <Link
                                    href={item.href}
                                    className="flex items-center gap-x-2 text-gray-600 p-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 duration-150"
                                >
                                    <div className="text-gray-500">{item.icon}</div>
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
