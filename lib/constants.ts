type Carrier = {
	id: 'hapag' | 'zim';
	name: string;
	description: string;
	color: string;
	examples: string[];
};

export const CARRIERS: Carrier[] = [
	{
		id: 'hapag' as const,
		name: 'Hapag-Lloyd',
		description: 'Números como HLCUGDN0000000',
		color: '#ef4444',
		examples: ['HLCUGDN0000000'],
	},
	{
		id: 'zim' as const,
		name: 'ZIM Integrated Shipping',
		description: 'Números como ZIMUNNJ1011275',
		color: '#3b82f6',
		examples: ['ZIMUNNJ1011275'],
	},
];
