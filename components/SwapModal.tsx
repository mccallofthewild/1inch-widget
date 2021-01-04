export const SwapModal = (props: {
	isVisible: boolean;
	children: React.ReactNode;
}) => {
	return (
		<div
			style={{
				display: 'flex',
				transition: 'all 250ms ease-in-out',
				pointerEvents: props.isVisible ? 'all' : 'none',
				opacity: props.isVisible ? 1 : 0,
				transform: props.isVisible ? 'translateY(0px)' : 'translateY(1000px)',
				position: 'absolute',
				margin: 0,
				top: 0,
				bottom: 0,
				left: 0,
				right: 0,
				height: '100%',
				width: '100%',
				zIndex: 10,
				overflow: 'hidden',
			}}
		>
			{props.children}
		</div>
	);
};
