import React from 'react';
// fixed ios safari compatibility
export const Touchable = (
	props: React.DetailedHTMLProps<
		React.HTMLAttributes<HTMLDivElement>,
		HTMLDivElement
	>
) => {
	return (
		<div
			{...props}
			style={{
				cursor: 'pointer',
				...props.style,
			}}
		>
			{props.children}
		</div>
	);
};
