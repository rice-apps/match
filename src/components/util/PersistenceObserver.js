import React from 'react';
import { useTransactionObservation_UNSTABLE } from 'recoil';


export default function PersistenceObserver() {
    useTransactionObservation_UNSTABLE(({ atomValues, atomInfo, modifiedAtoms }) => {
        for (const modifiedAtom of modifiedAtoms) {
            let value = JSON.stringify({ value: atomValues.get(modifiedAtom) });
            console.log("Storing into local storage atom state:", modifiedAtom, atomValues.get(modifiedAtom));
            localStorage.setItem(modifiedAtom, value);
        }
    });
    return <></>
}
