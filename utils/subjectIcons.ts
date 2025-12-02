import { Ionicons } from '@expo/vector-icons';

export const getSubjectIcon = (subject: string): keyof typeof Ionicons.glyphMap => {
    const normalizedSubject = subject?.toLowerCase() || '';
    if (normalizedSubject.includes('computer') || normalizedSubject.includes('software') || normalizedSubject.includes('programming')) {
        return 'laptop-outline';
    } else if (normalizedSubject.includes('math') || normalizedSubject.includes('algebra') || normalizedSubject.includes('calculus')) {
        return 'calculator-outline';
    } else if (normalizedSubject.includes('science') || normalizedSubject.includes('physics')) {
        return 'flask-outline';
    } else if (normalizedSubject.includes('chem')) {
        return 'flask-outline';
    } else if (normalizedSubject.includes('bio')) {
        return 'leaf-outline';
    } else if (normalizedSubject.includes('english') || normalizedSubject.includes('literature')) {
        return 'book-outline';
    } else if (normalizedSubject.includes('history') || normalizedSubject.includes('geography')) {
        return 'globe-outline';
    } else if (normalizedSubject.includes('art') || normalizedSubject.includes('design')) {
        return 'color-palette-outline';
    } else if (normalizedSubject.includes('music')) {
        return 'musical-notes-outline';
    } else if (normalizedSubject.includes('sport') || normalizedSubject.includes('pe')) {
        return 'basketball-outline';
    }
    return 'school-outline';
};
