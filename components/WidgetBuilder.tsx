import {
	AutoComplete,
	Button,
	Card,
	Code,
	Divider,
	Grid,
	Image,
	Loading,
	Spacer,
	Spinner,
	Tag,
	Text,
	useBodyScroll,
	useClipboard,
	useToasts,
} from '@geist-ui/react';
import { Copy } from '@geist-ui/react-icons';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { getGradients } from '../helpers/getGradients';
import { useAllTokens } from '../hooks/useAllTokens';
import { useNextTick } from '../hooks/useNextTick';
import { useProvider } from '../hooks/useProvider';
import { TokenSearch } from './TokenSearch';

export const WidgetBuilder = () => {
	const [iframeUrl, setIframeUrl] = useState(``);
	const [widgetHtml, setWidgetHtml] = useState('');
	const clipboard = useClipboard();
	const [toast, setToast] = useToasts();
	const allTokens = useAllTokens();
	const widgetRef = useRef<HTMLIFrameElement>();
	const [iframeLoaded, setIframeLoaded] = useState(false);
	const [state, setState] = useState<{
		toTokenSymbol: string;
		shouldRenderIframe: boolean;
	}>({ toTokenSymbol: null, shouldRenderIframe: false });
	const scrollTargetRef = useRef();
	const provider = useProvider();
	const nextTick = useNextTick();

	useEffect(() => {
		const url = `${window.location.origin}/widget${
			state.toTokenSymbol ? `?toToken=${state.toTokenSymbol}` : ''
		}`;
		if (url != iframeUrl) {
			setIframeLoaded(false);
			setIframeUrl(url);
		}
	}, [state.toTokenSymbol]);

	useEffect(() => {
		nextTick().then(() => {
			const html = widgetRef?.current?.outerHTML;
			if (html != widgetHtml) {
				setWidgetHtml(html);
			}
		});
	}, [
		iframeUrl,
		widgetRef.current?.outerHTML,
		state.shouldRenderIframe,
		iframeLoaded,
	]);

	useEffect(() => {
		const listener = (e) => {
			if (!scrollTargetRef.current) return;
			const shouldRenderIframe = isElementInViewport(scrollTargetRef.current);
			if (shouldRenderIframe) {
				setState({
					...state,
					shouldRenderIframe,
				});
				window.document.removeEventListener('scroll', listener);
			}
		};
		window.document.addEventListener('scroll', listener);
	}, [!!scrollTargetRef.current]);

	return (
		<Grid.Container xs={24} justify='space-around'>
			<Grid xs={24}>
				<Text
					h1
					style={{
						cursor: 'pointer',
						fontSize: 69,
						color: '#FFFFFF',
						fontWeight: 800,
						lineHeight: '1.2em',
						textAlign: 'center',
					}}
				>
					Got ERC20?
				</Text>
				<Text p style={{ textAlign: 'center', color: 'white' }}>
					Bruce enables customers to buy {state.toTokenSymbol || 'tokens'}{' '}
					directly from your website
				</Text>
				<Spacer y={3}></Spacer>
			</Grid>
			<Grid.Container gap={2} justify='space-around' md={20}>
				<Grid xs={24} md={12}>
					<TokenSearch
						closeElement={
							<Tag style={{ opacity: +!!state.toTokenSymbol }} type='lite'>
								Clear
							</Tag>
						}
						shouldHoldScrollPositionOnSelect={true}
						title={`Select Output Token`}
						provider={provider}
						onSelect={(t) => setState({ ...state, toTokenSymbol: t.symbol })}
						style={{ margin: 0, borderRadius: 4 }}
						onClose={() => {
							setState({
								...state,
								toTokenSymbol: null,
							});
						}}
					></TokenSearch>
					{/* <Text small>
						Define a static output token to restrict the output to one token.
						This option works best for crypto organizations who want to provide
						a means by which to purchase tokens, directly from their site.
					</Text> */}
				</Grid>
				<Grid xs={24} md={12}>
					<Image.Browser
						url={`https://${
							state.toTokenSymbol
								? state.toTokenSymbol?.toLowerCase() + '.'
								: ''
						}crypto.website`}
						anchorProps={{ rel: 'nofollow' }}
						style={{ backgroundColor: 'white', width: '100%' }}
					>
						<div
							ref={scrollTargetRef}
							style={{
								display: 'flex',
								justifyContent: 'center',
								width: '100%',
								backgroundColor: 'rgba(0,0,0,0.2)',
								// backgroundImage: getGradients().gradients[10],
								backgroundImage: `linear-gradient(to top, rgba(255,255,255,0.5), rgba(255,255,255,0.5)), url(/images/widget-builder-browser-background.png)`,
								backgroundSize: 'cover',
								backgroundRepeat: 'no-repeat',
								padding: '10px',
							}}
						>
							{!iframeLoaded ? (
								<div
									style={{
										height: 470,
										width: 340,
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
									}}
								>
									<Spinner color='white' size='large'></Spinner>
								</div>
							) : null}
							{state.shouldRenderIframe ? (
								<div
									style={{
										...(!iframeLoaded
											? {
													opacity: 0,
													pointerEvents: 'none',
													height: 0,
													width: 0,
											  }
											: {}),
									}}
								>
									<iframe
										ref={widgetRef}
										onLoad={() => setIframeLoaded(true)}
										frameBorder={0}
										src={iframeUrl}
										width={340}
										height={470}
									></iframe>
								</div>
							) : null}
						</div>
					</Image.Browser>
				</Grid>
				<Grid xs={24}>
					{widgetHtml ? (
						<Card
							style={{
								cursor: 'copy',
							}}
							onMouseDown={(e) => {
								if (!widgetHtml) return;
								clipboard.copy(widgetHtml);
								const s = window.getSelection();
								if (s.rangeCount > 0) s.removeAllRanges();
								const range = document.createRange();
								range.selectNode(e.currentTarget.querySelector('code'));
								s.addRange(range);
								setToast({
									text: 'Copied HTML to clipboard',
								});
							}}
						>
							<Text h3>Click to copy</Text>
							{/* <Divider></Divider> */}
							<mark style={{ backgroundColor: 'rgba(0,100,255,0.2)' }}>
								<Code>{widgetHtml}</Code>
							</mark>
						</Card>
					) : null}
				</Grid>
			</Grid.Container>
		</Grid.Container>
	);
};

function isElementInViewport(el: HTMLElement) {
	var rect = el.getBoundingClientRect();
	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom - rect.height <=
			(window.innerHeight ||
				document.documentElement.clientHeight) /* or $(window).height() */ &&
		rect.right <=
			(window.innerWidth ||
				document.documentElement.clientWidth) /* or $(window).width() */
	);
}
