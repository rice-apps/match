import React from 'react';

export default function Rule({rule}) {

    return (
        <div>
            <p>{JSON.stringify(rule)}</p>
        </div>
    )
}