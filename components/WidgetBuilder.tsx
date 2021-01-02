import {
	AutoComplete,
	Button,
	Card,
	Code,
	Divider,
	Grid,
	Image,
	Spacer,
	Spinner,
	Text,
	useClipboard,
	useToasts,
} from '@geist-ui/react';
import { Copy } from '@geist-ui/react-icons';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { getGradients } from '../helpers/getGradients';
import { useAllTokens } from '../hooks/useAllTokens';

export const WidgetBuilder = () => {
	const [iframeUrl, setIframeUrl] = useState(``);
	const [widgetHtml, setWidgetHtml] = useState('');
	const clipboard = useClipboard();
	const toast = useToasts();
	const allTokens = useAllTokens();
	const widgetRef = useRef<HTMLElement>();
	const [state, setState] = useState<{
		toTokenSymbol: string;
	}>({ toTokenSymbol: null });

	useEffect(() => {
		setIframeUrl(
			`${window.location.origin}/widget${
				state.toTokenSymbol ? `?toToken=${state.toTokenSymbol}` : ''
			}`
		);
	}, [state.toTokenSymbol]);

	useEffect(() => {
		const html = widgetRef?.current?.outerHTML;
		if (html != widgetHtml) {
			setWidgetHtml(html);
		}
	}, [iframeUrl]);

	return (
		<Grid.Container xs={24} justify='space-around'>
			<Grid xs={24}>
				<Text h1 style={{ textAlign: 'center', color: 'white' }}>
					#BUIDL Your Widget
				</Text>
			</Grid>
			<Grid.Container>
				<Grid xs={24} md={12}>
					<Card>
						<Text h4>Options</Text>

						<AutoComplete
							disableFreeSolo
							onSelect={(v) => {
								setIframeUrl(`${window.location.origin}/widget?toToken=${v}`);
							}}
							placeholder='Select Output Token'
							options={allTokens.map((t) => ({
								label: t.symbol,
								value: t.symbol,
							}))}
						></AutoComplete>
						<Text small>
							Define a static output token to restrict the output to one token.
							This option works best for crypto organizations who want to
							provide a means by which to purchase tokens, directly from their
							site.
						</Text>
					</Card>
					<Spacer y={1}></Spacer>
					<Card shadow>
						<Grid.Container alignItems='center' justify='space-between'>
							<div>
								<Text h4>Embed Code</Text>
								<Text small>
									Insert the generated code snippet on your website
								</Text>
							</div>
							<Button
								size='small'
								onClick={() => {
									clipboard.copy(widgetHtml);
									toast[1]({
										text: 'Copied embed HTML!',
									});
								}}
								iconRight={<Copy></Copy>}
							>
								Copy HTML{' '}
							</Button>
						</Grid.Container>
						<Divider></Divider>
						<Code style={{ color: 'black' }}>{widgetHtml}</Code>
					</Card>
					<Spacer y={2}></Spacer>
				</Grid>
				<Grid xs={24} md={12}>
					<Image.Browser
						url='https://crypto.website'
						anchorProps={{ rel: 'nofollow' }}
						style={{ backgroundColor: 'white', width: '90%' }}
					>
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								width: '100%',
								backgroundColor: 'black',
								backgroundImage: getGradients().gradients[10],
								backgroundSize: 'cover',
								backgroundRepeat: 'no-repeat',
								padding: '10px',
							}}
						>
							<iframe
								ref={widgetRef}
								style={{ border: 'none' }}
								src={iframeUrl}
								width={340}
								height={470}
							></iframe>
						</div>
					</Image.Browser>
				</Grid>
			</Grid.Container>
		</Grid.Container>
	);
};