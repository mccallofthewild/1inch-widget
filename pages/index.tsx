import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';
import { getSortedPostsData } from '../lib/posts';
import Link from 'next/link';
import Date from '../components/date';
import { WidgetBuilder } from '../components/WidgetBuilder';
import { Card, Code } from '@geist-ui/react';
import { useLayoutEffect, useState } from 'react';

export default function Home({ allPostsData }) {
	let origin = 'http://localhost:3000';
	if (process.browser) {
		origin = window.location.origin;
	}
	const [widgetHtml, setWidgetHtml] = useState('');
	const iframeUrl = `${origin}/widget`;
	useLayoutEffect(() => {
		const html = document.getElementById('widget-html').outerHTML;
		if (html != widgetHtml) {
			setWidgetHtml(html);
		}
	});
	return (
		<Layout home>
			<Head>
				<title>{siteTitle}</title>
			</Head>
			<iframe
				id='widget-html'
				style={{ border: 'none' }}
				src={iframeUrl}
				height='300'
				width='100%'
			></iframe>
			<Card shadow>
				<Code>{widgetHtml}</Code>
			</Card>
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
