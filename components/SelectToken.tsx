import { OneInchGraph } from '../generated/OneInchGraph';
import { Token } from '../generated/openapi';
import { AutoComplete, Avatar, Select } from '@geist-ui/react';
import { useState } from 'react';

export const SelectToken = (props: {
	onInput: (t: OneInchGraph.Token) => void;
	tokens: OneInchGraph.Token[];
	label: string;
}) => {
	const options = props.tokens.map((t) => ({
		label: t.symbol,
		value: t.symbol,
	}));
	const [visibleTokens, setVisibleTokens] = useState(options);
	return (
		<AutoComplete
			searching={!props.tokens.length}
			placeholder={props.label}
			disabled={!props.tokens.length}
			size={'large'}
			onSearch={(val) => {
				setVisibleTokens(
					options.filter((o) =>
						o.value.toLowerCase().startsWith(val.toLowerCase())
					)
				);
			}}
			disableFreeSolo
			onSelect={async (v) => {
				let token: OneInchGraph.Token = props.tokens.find((t) => t.symbol == v);
				props.onInput(token);
			}}
			options={visibleTokens}
		></AutoComplete>
	);
};

const Icon = (props: { address }) => {
	const { address } = props;
	const imageUrls = [
		`https://tokens.1inch.exchange/${address}.png`,
		`https://raw.githubusercontent.com/trustwallet/tokens/master/tokens/${address}.png`,
	];
	return <Avatar src={imageUrls[0]}></Avatar>;
};
