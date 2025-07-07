
export const formatarCPF = (value: string): string => {
    let v = value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return v;
};

export const formatarTelefone = (value: string): string => {
    let v = value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    v = v.replace(/^(\d{2})(\d)/, '($1) $2');
    if (v.length > 9) {
        v = v.replace(/(\d{5})(\d)/, '$1-$2');
    } else {
        v = v.replace(/(\d{4})(\d)/, '$1-$2');
    }
    return v;
};
