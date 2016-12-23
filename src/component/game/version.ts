
// masao-json-format version to limited set.
export function acceptVersion(version: string): '2.8' | 'fx16' | 'kani2'{
    if (version === 'kani' || version === 'kani2'){
        return 'kani2';
    }
    if (version.slice(0, 2) === 'fx'){
        return 'fx16';
    }
    return '2.8';
}
