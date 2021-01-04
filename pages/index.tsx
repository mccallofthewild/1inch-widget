import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import Link from 'next/link';
import {
	Button,
	Card,
	Code,
	Grid,
	Row,
	Spacer,
	Text,
	useMediaQuery,
} from '@geist-ui/react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Swap } from '../components/Swap';
import { ArrowRight, ChevronDown } from '@geist-ui/react-icons';
import { getStaticProps as widgetGetStaticProps, WidgetProps } from './widget';
import { GetStaticProps } from 'next';
import { Store } from '../contexts/Store';
import { animateHomePageText } from '../helpers/animateHomePageText';
import { WidgetBuilder } from '../components/WidgetBuilder';
import styles from './index.module.css';
import { Touchable } from '../components/Touchable';
export default function Home(props: WidgetProps) {
	const store = Store.useContext();

	useEffect(() => {
		if (props.preloadedTokenImageDataUris) {
			for (let imageUrl in props.preloadedTokenImageDataUris) {
				store.dispatch('AddPreloadedDataImageUri', {
					url: imageUrl,
					dataURI: props.preloadedTokenImageDataUris[imageUrl],
				});
			}
		}
		if (props.allTokens) {
			store.dispatch('SetAllTokens', props.allTokens);
		}
	}, []);

	useEffect(() => {
		if (!process.browser) return;
		animateHomePageText();
	}, []);

	const isSmallScreen = useMediaQuery('md', {
		match: 'down',
		ssrMatchMedia: (query) => {
			console.log({ query });
			return {
				matches: true,
			};
		},
	});

	console.log({ isSmallScreen });

	const textAlign = isSmallScreen ? 'center' : 'left';

	const scrollToBuilder = () => {
		document.getElementById('widget-builder-area').scrollIntoView({
			behavior: 'smooth',
		});
	};

	return (
		<Layout home>
			<Head>
				<title>{siteTitle}</title>
			</Head>
			<Grid.Container className={styles.hero_section}>
				<Grid.Container
					style={{
						// maxWidth: '800px',
						paddingTop: '10vh',
					}}
					justify='center'
					alignItems='center'
					xs={24}
				>
					<Grid.Container justify='center' gap={2} xs={24} md={14}>
						<Grid
							xs={24}
							md={12}
							justify='center'
							alignItems={isSmallScreen ? 'center' : 'flex-start'}
						>
							<Spacer y={2}></Spacer>
							<Grid xs={24} md={24} justify='center'>
								<div
									id='meet-bruce'
									style={{
										opacity: +process.browser,
										cursor: 'pointer',
										fontSize: 69,
										color: '#FFFFFF',
										fontWeight: 800,
										lineHeight: '1.2em',
										textAlign,
									}}
								>
									<span style={{ whiteSpace: 'nowrap' }}>MEET</span>
									<br />
									<span style={{ whiteSpace: 'nowrap' }}>BRUCE.</span>
								</div>
								<Grid
									id='hero-description'
									style={{
										opacity: +process.browser,
										marginTop: 10,
										color: 'white',
										fontWeight: 200,
										// fontStyle: 'italic',
										fontSize: 20,
										textAlign,
										// alignSelf: 'flex-end',
									}}
								>
									The Swap UX that <br></br> packs a punch{' '}
									<div id='fist' style={{ display: 'inline-block' }}>
										👊
									</div>
								</Grid>
								<Spacer y={1}></Spacer>
								<Grid style={{ textAlign }}>
									<Button
										onClick={() => scrollToBuilder()}
										style={{ opacity: +process.browser }}
										id='get-started-button'
										color='black'
										iconRight={<ArrowRight></ArrowRight>}
									>
										GET STARTED
									</Button>
								</Grid>
								<Grid.Container
									xs={24}
									justify={isSmallScreen ? 'center' : 'flex-start'}
								></Grid.Container>
							</Grid>
						</Grid>
						<Grid xs={22} md={12} justify='center' alignItems='center'>
							<div
								id='hero-swap'
								style={{
									position: 'relative',
									// width: 340,
									height: 470,
									opacity: +process.browser,
								}}
							>
								<Swap allTokens={props.allTokens}></Swap>
							</div>
						</Grid>
					</Grid.Container>
				</Grid.Container>
				<Grid.Container justify='center'>
					<Touchable
						style={{
							cursor: 'pointer',
							textAlign: 'center',
							opacity: '0.5',
							marginTop: '100px',
						}}
						onClick={() => {
							scrollToBuilder();
						}}
					>
						<div className={'animation_hover'}>
							<ChevronDown color='white'></ChevronDown>
						</div>
					</Touchable>
				</Grid.Container>
			</Grid.Container>

			<Grid.Container>
				<div id='widget-builder-area'></div>
				<WidgetBuilder></WidgetBuilder>
				{/* <Grid
					style={{
						fontStyle: 'italic',
						fontSize: '15px',
						fontWeight: 300,
						color: 'rgba(255,255,255,0.9)',
						textAlign: isSmallScreen ? 'center' : 'left',
					}}
				>
					via
					<a
						href='https://1inch.exchange'
						style={{ cursor: 'pointer' }}
						target='_blank'
					>
						<img
							style={{
								display: 'inline-block',
								// float: 'right',
								marginBottom: '-10px',
								width: '200px',
								color: 'white',
							}}
							src='./images/one-inch-logo--light.svg'
						/>
					</a>
				</Grid> */}
			</Grid.Container>
			<Grid.Container direction='column' justify='center' alignItems='center'>
				<p
					style={{
						fontSize: '3rem',
						color: 'white',
						textAlign: 'center',
						fontStyle: 'italic',
						fontWeight: 100,
					}}
				>
					"there is no weapon more deadly <br></br> than the will"
				</p>
				<br />
				<img width={300} src='./images/bruce-lee-signature.png' alt='' />
			</Grid.Container>
			<Spacer y={5}></Spacer>
			<Grid.Container>
				<p style={{ color: 'rgba(255,255,255,0.3)' }}>
					© McCall Alexander, 2021
				</p>
			</Grid.Container>
		</Layout>
	);
}

export const getStaticProps: GetStaticProps = async (...args) => {
	return widgetGetStaticProps(...args);
};
