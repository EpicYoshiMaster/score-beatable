import classNames from "classnames";
import { useRef, useState, type ButtonHTMLAttributes, type SelectHTMLAttributes } from "react";
import { NavLink, type NavLinkProps } from "react-router";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { formatRating } from "~/utils/format";

gsap.registerPlugin(useGSAP); // register the hook to avoid React version discrepancies 

export const Slash: React.FC = () => {
	return (
		<span className="slash" aria-hidden>{'// '}</span>
	)
}

type ButtonProps = {
	selected?: boolean;
	children?: React.ReactNode;
	noSlash?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: React.FC<ButtonProps> = ({ children, selected, className, noSlash, ...props }) => {
	const mergedClassName = classNames('common__control common__button', {
		'common__selected': selected,
	}, className);

	return (
		<button {...props} className={mergedClassName}>
			{!noSlash && (<Slash />)}
			{children}
		</button>
	);
}

type RatingProps = {
	value: number;
	defaultValue?: number;
	className?: string;
	duration?: number;
};

export const Rating: React.FC<RatingProps> = ({ value, className, duration = 3, defaultValue = 0 }) => {
	const containerRef = useRef<HTMLSpanElement | null>(null);
	const [prevValue, setPrevValue] = useState(defaultValue);
	const [displayValue, setDisplayValue] = useState(value);

	useGSAP(() => {
		const progress = {
			rating: prevValue
		}

		gsap.to(progress, { 
			duration, 
			rating: value,
			ease: "circ.out",
			onUpdate: () => { setDisplayValue(progress.rating); },
			onComplete: () => { setPrevValue(value); } 
		})
	}, { dependencies: [value, duration], scope: containerRef });

	const mergedClassName = classNames('common__rating', className);

	return (
		<span ref={containerRef} className={mergedClassName}>{formatRating(displayValue)}</span>
	);
}

type CustomNavLinkProps = {
	children?: React.ReactNode;
} & NavLinkProps;

export const CustomNavLink: React.FC<CustomNavLinkProps> = ({ children, className, ...props }) => {
	return (
		<NavLink {...props} className={({ isActive, isPending }) => classNames('common__control common__link', { 'common__selected': isActive || isPending }, className)}>
			<Slash />
			{children}
		</NavLink>
	);
}

type SelectProps = {
	children: React.ReactNode;
} & SelectHTMLAttributes<HTMLSelectElement>;

export const Select: React.FC<SelectProps> = ({ children, className, ...props }) => {
	const mergedClassName = classNames('common__control common__select', className);

	return (
		<select {...props} className={mergedClassName}>
			{children}
		</select>
	);
}