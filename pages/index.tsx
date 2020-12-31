import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import { getSortedPostsData } from '../lib/posts';
import Link from 'next/link';
import { WidgetBuilder } from '../components/WidgetBuilder';
import { Card, Code } from '@geist-ui/react';
import { useLayoutEffect, useState } from 'react';
import { TokenSearch } from '../components/TokenSearch';
import { Swap } from '../components/Swap';

export default function Home({ allPostsData }) {
	const [iframeUrl, setIframeUrl] = useState(``);
	const [widgetHtml, setWidgetHtml] = useState('');
	// useLayoutEffect(() => {
	// 	setIframeUrl(`${window.location.origin}/widget`);
	// 	const html = document.getElementById('widget-html').outerHTML;
	// 	if (html != widgetHtml) {
	// 		setWidgetHtml(html);
	// 	}
	// });
	return (
		<Layout home>
			<Head>
				<title>{siteTitle}</title>
			</Head>
			<div style={{ display: 'flex', justifyContent: 'center' }}>
				<div style={{ width: 400 }}>
					<h1 style={{ textAlign: 'center' }}>Coming Soon 😏</h1>
					{/* <TokenSearch></TokenSearch> */}
					<Swap></Swap>
				</div>
			</div>
			{/* <iframe
				id='widget-html'
				style={{ border: 'none' }}
				src={iframeUrl}
				height='300'
				width='100%'
			></iframe> */}
			{/* <Card shadow>
				<Code>{widgetHtml}</Code>
			</Card> */}
		</Layout>
	);
}

export async function getStaticProps() {
	const allPostsData = getSortedPostsData();
	return {
		props: {
			allPostsData,
		},
	};
}
