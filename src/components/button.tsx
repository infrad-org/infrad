import React from 'react';

export function Button(props: React.HTMLAttributes<HTMLButtonElement> & {children: string}) {
  return <button {...props}>
      {props.children}
    </button>
}