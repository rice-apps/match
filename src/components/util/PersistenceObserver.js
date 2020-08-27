import React from 'react';
import { useTransactionObservation_UNSTABLE } from 'recoil';

// See https://recoiljs.org/docs/guides/persistence for documentation on how to persist state in local storage using Recoil
// This is what this PersistenceObserver allows us.

export default function PersistenceObserver() {
    useTransactionObservation_UNSTABLE(({ atomValues, atomInfo, modifiedAtoms }) => {
        for (const modifiedAtom of modifiedAtoms) {
            let value = JSON.stringify({ value: atomValues.get(modifiedAtom) });
            // console.log("Storing into local storage atom state:", modifiedAtom, atomValues.get(modifiedAtom));
            localStorage.setItem(modifiedAtom, value);
        }
    });
    return <></>
}
