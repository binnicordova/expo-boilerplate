import {useAtomValue} from "jotai";
import {useEffect} from "react";
import {changeLocale} from "@/i18n";
import {localeAtom} from "@/stores/locale";

/**
 * i18next boots on the device language so the first frame is already
 * translated; this pushes the persisted override in once storage hydrates.
 */
export const useLocaleSync = () => {
    const locale = useAtomValue(localeAtom);

    useEffect(() => {
        void changeLocale(locale);
    }, [locale]);
};
