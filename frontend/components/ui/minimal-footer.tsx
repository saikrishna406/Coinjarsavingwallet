import {
    FacebookIcon,
    GithubIcon,
    Grid2X2Plus,
    InstagramIcon,
    LinkedinIcon,
    TwitterIcon,
    YoutubeIcon,
    Coins
} from 'lucide-react';

export function MinimalFooter() {
    const year = new Date().getFullYear();

    const company = [
        {
            title: 'About Us',
            href: '#',
        },
        {
            title: 'Careers',
            href: '#',
        },
        {
            title: 'Brand assets',
            href: '#',
        },
        {
            title: 'Privacy Policy',
            href: '#',
        },
        {
            title: 'Terms of Service',
            href: '#',
        },
    ];

    const resources = [
        {
            title: 'Blog',
            href: '#',
        },
        {
            title: 'Help Center',
            href: '#',
        },
        {
            title: 'Contact Support',
            href: '#',
        },
        {
            title: 'Community',
            href: '#',
        },
        {
            title: 'Security',
            href: '#',
        },
    ];

    const socialLinks = [
        {
            icon: <FacebookIcon className="size-4" />,
            link: '#',
        },
        {
            icon: <GithubIcon className="size-4" />,
            link: '#',
        },
        {
            icon: <InstagramIcon className="size-4" />,
            link: '#',
        },
        {
            icon: <LinkedinIcon className="size-4" />,
            link: '#',
        },
        {
            icon: <TwitterIcon className="size-4" />,
            link: '#',
        },
        {
            icon: <YoutubeIcon className="size-4" />,
            link: '#',
        },
    ];
    return (
        <footer className="relative w-full border-t border-white/10 pt-10">
            <div className="bg-[radial-gradient(35%_80%_at_30%_0%,--theme(--color-foreground/.1),transparent)] mx-auto max-w-7xl px-6 md:border-x border-white/10">
                <div className="bg-border absolute inset-x-0 h-px w-full" />
                <div className="grid max-w-7xl grid-cols-6 gap-6 p-4">
                    <div className="col-span-6 flex flex-col gap-5 md:col-span-4">
                        <a href="#" className="w-max opacity-100 flex items-center gap-2">
                            <Coins className="size-8 text-primary " />
                            <span className="font-bold text-xl">CoinJar</span>
                        </a>
                        <p className="text-muted-foreground max-w-sm font-mono text-sm text-balance">
                            The smart way to turn small change into big dreams. Automate your savings today.
                        </p>
                        <div className="flex gap-2">
                            {socialLinks.map((item, i) => (
                                <a
                                    key={i}
                                    className="hover:bg-accent rounded-md border border-white/10 p-1.5 transition-colors"
                                    target="_blank"
                                    href={item.link}
                                >
                                    {item.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="col-span-3 w-full md:col-span-1">
                        <span className="text-muted-foreground mb-1 text-xs">
                            Resources
                        </span>
                        <div className="flex flex-col gap-1">
                            {resources.map(({ href, title }, i) => (
                                <a
                                    key={i}
                                    className={`w-max py-1 text-sm duration-200 hover:underline text-neutral-300`}
                                    href={href}
                                >
                                    {title}
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="col-span-3 w-full md:col-span-1">
                        <span className="text-muted-foreground mb-1 text-xs">Company</span>
                        <div className="flex flex-col gap-1">
                            {company.map(({ href, title }, i) => (
                                <a
                                    key={i}
                                    className={`w-max py-1 text-sm duration-200 hover:underline text-neutral-300`}
                                    href={href}
                                >
                                    {title}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="bg-border absolute inset-x-0 h-px w-full" />
                <div className="flex max-w-7xl flex-col justify-between gap-2 pt-2 pb-5 border-t border-white/10 mt-10">
                    <p className="text-muted-foreground text-center font-thin">
                        © {year} <a href="#" className="hover:underline">CoinJar</a>. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
