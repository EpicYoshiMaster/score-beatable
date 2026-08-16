import classNames from "classnames";
import type { ButtonHTMLAttributes, SelectHTMLAttributes } from "react";
import { NavLink, type NavLinkProps } from "react-router";

export const Slash: React.FC = () => {
	return (
		<span className="slash" aria-hidden>{'// '}</span>
	)
}

type ButtonProps = {
	selected?: boolean;
	children: React.ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: React.FC<ButtonProps> = ({ children, selected, className, ...props }) => {
	const mergedClassName = classNames('common__control common__button', {
		'common__selected': selected,
	}, className);

	return (
		<button {...props} className={mergedClassName}>
			<Slash />
			{children}
		</button>
	);
}

type CustomNavLinkProps = {
	children: React.ReactNode;
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