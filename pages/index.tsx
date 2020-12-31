import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import Link from 'next/link';
import { Card, Code, Text, useMediaQuery } from '@geist-ui/react';
import { useLayoutEffect, useState } from 'react';
import { TokenSearch } from '../components/TokenSearch';
import { Swap } from '../components/Swap';
import pageStyles from './index.module.css';
import { ChevronDown } from '@geist-ui/react-icons';
export default function Home({ allPostsData }) {
	const [iframeUrl, setIframeUrl] = useState(``);
	const [widgetHtml, setWidgetHtml] = useState('');
	useLayoutEffect(() => {
		setIframeUrl(`${window.location.origin}/widget`);
		const html = document.getElementById('widget-html').outerHTML;
		if (html != widgetHtml) {
			setWidgetHtml(html);
		}
	});
	const isSmallScreen = useMediaQuery('sm', {
		match: 'down',
	});

	console.log({ isSmallScreen });

	return (
		<Layout home>
			<Head>
				<title>{siteTitle}</title>
			</Head>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					height: '100%',
					width: '100%',
				}}
			>
				<div
					style={{
						display: 'flex',
						flexWrap: 'wrap',
						justifyContent: 'center',
						alignItems: isSmallScreen ? 'center' : 'flex-start',
						height: '100%',
						maxWidth: '800px',
						marginTop: '20vh',
					}}
				>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							width: isSmallScreen ? '100%' : '50%',
							marginTop: 30,
						}}
					>
						<div
							style={{
								fontSize: isSmallScreen ? 30 : 69,
								color: '#FFFFFF',
								fontWeight: 800,
								lineHeight: '1.2em',
								textAlign: isSmallScreen ? 'center' : 'left',
							}}
						>
							MEET BRUCE.
						</div>
						<div
							style={{
								display: 'flex',
								marginTop: 54,
								color: 'white',
								fontWeight: 700,
								// alignSelf: 'flex-end',
							}}
						>
							The Ethereum swap UI that <br></br> packs a punch
						</div>
						<div
							style={{
								display: 'flex',
								marginTop: 20,
								// alignSelf: 'flex-end',
							}}
						>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: isSmallScreen ? 'center' : 'flex-start',
									padding: '7px 20px',
									paddingLeft: 10,
									color: 'white',
									width: '100%',
									textAlign: isSmallScreen ? 'center' : 'left',
								}}
							>
								<div
									style={{
										fontStyle: 'italic',
										fontSize: '15px',
										fontWeight: 300,
										color: 'rgba(255,255,255,0.9)',
										textAlign: isSmallScreen ? 'center' : 'left',
									}}
								>
									via
								</div>
								<a
									href='https://1inch.exchange'
									style={{ cursor: 'pointer' }}
									target='_blank'
								>
									<img
										style={{
											display: 'inline-block',
											float: 'right',
											width: '70px',
											color: 'white',
										}}
										src='./images/one-inch-logo--light.svg'
									/>
								</a>
							</div>
						</div>
					</div>
					<iframe
						id='widget-html'
						style={{ border: 'none' }}
						src={iframeUrl}
						width={340}
						height={500}
					></iframe>
					{/* <div style={{ width: 400 }}>
					<TokenSearch></TokenSearch>
					<Swap></Swap>
				</div> */}
				</div>
				<div>
					<div style={{ textAlign: 'center', opacity: '0.5', marginTop: 50 }}>
						<div style={{ color: 'white' }}>Get Started</div>
						<div className={'animation_hover'}>
							<ChevronDown color='white'></ChevronDown>
						</div>
					</div>
				</div>
				{/* <Card shadow>
				<Code>{widgetHtml}</Code>
			</Card> */}
			</div>
		</Layout>
	);
}

export async function getStaticProps() {
	return { props: {} };
}
