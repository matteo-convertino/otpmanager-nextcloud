import {Modal, Stack} from "@mantine/core";

import firefoxImage from "@/assets/firefox.svg";
import chromeImage from "@/assets/chrome.svg";
import appstoreImage from "@/assets/appstore.svg";
import googlePlayImage from "@/assets/google_play.svg";

import {AppCard} from "../utils/AppCard";
import {useModalsStore} from "@/context/useModalsStore.ts";

export function Apps() {
    const {showApps, setShowApps} = useModalsStore();

    return (
        <Modal
            opened={showApps}
            onClose={() => setShowApps(false)}
            title="Apps"
            size="xl"
        >
            <Stack>
                <AppCard
                    title="OTP Manager"
                    description="OTP Manager is an Android application designed to simplify the
            management of OTP (One-Time Password) codes and allow you to
            access to your OTP codes in a secure and convenient way. The
            application has been developed to work in synergy with your
            personal Nextcloud server, which allows you to store and manage
            your OTP codes securely and accessibly from anywhere."
                    image={googlePlayImage}
                    badges={[{text: "Android"}]}
                    buttons={[
                        {
                            text: "Install from Google Play",
                            link: "https://play.google.com/store/apps/details?id=com.convertino.otp_manager",
                        },
                    ]}
                />

                <AppCard
                    title="OTP Manager"
                    description="OTP Manager is an iOS application designed to simplify the
                  management of OTP (One-Time Password) codes and allow you to
                  access to your OTP codes in a secure and convenient way. The
                  application has been developed to work in synergy with your
                  personal Nextcloud server, which allows you to store and manage
                  your OTP codes securely and accessibly from anywhere."
                    image={appstoreImage}
                    badges={[{text: "iOS"}]}
                    buttons={[{text: "Install from Apple Store", disabled: true}]}
                />

                <AppCard
                    title="OTP Manager"
                    description="The OTP Manager extension, available on the Firefox Add-ons,
            securely manages your OTP codes with your personal Nextcloud
            server. With this extension, you can conveniently access all of
            your accounts, generate TOTP and HOTP codes and much more directly
            from Firefox."
                    image={firefoxImage}
                    badges={[
                        {text: "Firefox Extension"},
                    ]}
                    buttons={[
                        {
                            text: "Install from Firefox Add-ons",
                            link: "https://addons.mozilla.org/firefox/addon/nextcloud-otp-manager/",
                        },
                        {
                            text: "Install from Firefox Add-ons (Third-party author)",
                            link: "https://addons.mozilla.org/en-US/firefox/addon/simple-otpmanager-browser/",
                        },
                    ]}
                />

                <AppCard
                    title="OTP Manager"
                    description="The OTP Manager extension, available on the Chrome Web Store,
            securely manages your OTP codes with your personal Nextcloud
            server. With this extension, you can conveniently access all of
            your accounts, generate TOTP and HOTP codes and much more directly
            from many Chromium based Browsers."
                    image={chromeImage}
                    badges={[
                        {text: "Chrome Extension"},
                    ]}
                    buttons={[
                        {
                            text: "Install from Chrome Web Store",
                            link: "https://chromewebstore.google.com/detail/ljbdflkioncfbcncbnijleofalpakhlf",
                        },
                        {
                            text: "Install from Chrome Web Store (Third-party author)",
                            link: "https://chromewebstore.google.com/detail/simple-otp-manager-browse/meopmcadkhpcpoaigkhkadagiemblecc",
                        },
                    ]}
                />
            </Stack>
        </Modal>
    );
}
