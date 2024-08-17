import { atom } from 'jotai';
/*first page*/
export const salaryAtom = atom(0);
export const jobAtom = atom('');
export const otherCreditsAtom = atom('');

export const salaryValidAtom = atom(true);
export const jobValidAtom = atom(true);
export const otherCreditsValidAtom = atom(true);

/*second page*/
export const ageAtom = atom(40);
export const diseaseAtom = atom('');



/*third page*/
export const requestedCreditsAtom = atom('');
export const creditTypeAtom = atom('');
export const dateAtom = atom('');

/* Result */
export const predictionAtom = atom(null);