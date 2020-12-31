import Head from 'next/head';
import styles from './layout.module.css';
import Link from 'next/link';

const name = '[Your Name]';
export const siteTitle = 'BRUCE - DEX Crypto Swaps';

export default function Layout({ children, home }) {
	return (
		<div
			className={`${styles.container} ${home ? styles.container__home : ''}`}
		>
			<Head>
				<link rel='icon' href='/favicon.ico' />
				<meta
					name='description'
					content='The crypto token swap UX that packs a punch'
				/>
				{/* <meta
					property='og:image'
					content={`https://og-image.now.sh/${encodeURI(
						siteTitle
					)}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
				/> */}
				<meta name='og:title' content={siteTitle} />
				<meta name='twitter:card' content='summary_large_image' />
			</Head>
			<header className={styles.header}></header>
			<main>{children}</main>
			{!home && (
				<div className={styles.backToHome}>
					<Link href='/'>
						<a>← Back to home</a>
					</Link>
				</div>
			)}
		</div>
	);
}
