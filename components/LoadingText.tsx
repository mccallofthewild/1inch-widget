import { Loading, Spinner } from '@geist-ui/react';
import { ReactNode } from 'react';

export const LoadingText = (props: { text: ReactNode }) => {
	return props.text ? (
		<>{props.text}</>
	) : (
		<span
			style={{
				width: '20px',
				height: '8px',
				display: 'inline-block',
				position: 'relative',
			}}
		>
			<Loading style={{ width: '1em', height: '0.5em' }}></Loading>
		</span>
	);
};
