import defaultMdxComponents from 'fumadocs-ui/mdx';
import {
  Accordion as UIAccordion,
  Accordions as UIAccordions,
} from 'fumadocs-ui/components/accordion';
import { Callout as UICallout } from 'fumadocs-ui/components/callout';
import { Step as UIStep, Steps as UISteps } from 'fumadocs-ui/components/steps';
import { asMarkdown, md } from 'fumadocs-core/server';
import { Children, type ComponentProps, type ReactNode } from 'react';
import type { MDXComponents } from 'mdx/types';

/*
 * The components below render the default Fumadocs UI on the page. When the page is turned into
 * Markdown (the `.md` files and llms-full.txt), `asMarkdown()` is set and they return plain Markdown
 * instead, so agents get numbered lists, quotes and headings rather than JSX tags.
 */

function Steps({ children }: { children: ReactNode }) {
  if (asMarkdown()) return numberedList(children);
  return <UISteps>{children}</UISteps>;
}

function Step({ children }: { children: ReactNode }) {
  if (asMarkdown()) return md`${children}`;
  return <UIStep>{children}</UIStep>;
}

function Callout({ title, children, ...props }: ComponentProps<typeof UICallout>) {
  if (asMarkdown()) return quote(title, children);
  return (
    <UICallout title={title} {...props}>
      {children}
    </UICallout>
  );
}

function Accordions({ children, ...props }: ComponentProps<typeof UIAccordions>) {
  if (asMarkdown()) return md`${children}`;
  return <UIAccordions {...props}>{children}</UIAccordions>;
}

function Accordion({ title, id, children, ...props }: ComponentProps<typeof UIAccordion>) {
  if (asMarkdown()) return questionSection(title, id, children);
  return (
    <UIAccordion title={title} id={id} {...props}>
      {children}
    </UIAccordion>
  );
}

/** A callout as a block quote, its title in bold on the first line. */
async function quote(title: ReactNode, children: ReactNode) {
  const [heading, body] = await Promise.all([md`${title}`, md`${children}`]);
  const text = heading.trim() ? `**${heading.trim()}**\n\n${body.trim()}` : body.trim();
  return md.linePrefix('> ')`${text}`;
}

/** Steps as a Markdown ordered list, keeping any extra lines of a step inside its item. */
async function numberedList(children: ReactNode): Promise<string> {
  const steps = await Promise.all(Children.toArray(children).map((child) => md`${child}`));
  const items = steps
    .map((step) => step.trim())
    .filter((step) => step.length > 0)
    .map((step, index) => {
      const marker = `${index + 1}. `;
      const indent = ' '.repeat(marker.length);
      return marker + step.replace(/\n(?=.)/g, `\n${indent}`);
    });
  return `\n${items.join('\n')}\n\n`;
}

/** An accordion item as a heading and its answer, so the answer is never folded away. */
async function questionSection(title: ReactNode, id: string | undefined, children: ReactNode) {
  const [question, answer] = await Promise.all([md`${title}`, md`${children}`]);
  const anchor = id ? ` [#${id}]` : '';
  return `\n### ${question.trim()}${anchor}\n\n${answer.trim()}\n\n`;
}

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Callout,
    Steps,
    Step,
    Accordions,
    Accordion,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
