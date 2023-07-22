import React from "react";

import { Modal, Stack, ScrollArea } from "@mantine/core";

import otpManager from "../../../img/otp_manager.png";
import firefoxImage from "../../../img/firefox.svg";
import chromeImage from "../../../img/chrome.svg";

import { AppCard } from "../utils/AppCard";

export function Apps({ showApps, setShowApps }) {
  return (
    <Modal
      opened={showApps}
      onClose={() => setShowApps(false)}
      title="Apps"
      size="xl"
    >
      <ScrollArea.Autosize mah="calc(100vh - (10vh * 2))">
        <Stack>
          <AppCard
            title="OTP Manager"
            description="OTP Manager is an Android application designed to simplify the
            management of OTP (One-Time Password) codes and allow you to
            access to your OTP codes in a secure and convenient way. The
            application has been developed to work in synergy with your
            personal Nextcloud server, which allows you to store and manage
            your OTP codes securely and accessibly from anywhere."
            image={otpManager}
            badgeText="Android"
            buttonText="Install from Google Play"
            link="https://play.google.com/store/apps/details?id=com.convertino.otp_manager"
          />

          <AppCard
            title="OTP Manager"
            description="OTP Manager is an iOS application designed to simplify the
            management of OTP (One-Time Password) codes and allow you to
            access to your OTP codes in a secure and convenient way. The
            application has been developed to work in synergy with your
            personal Nextcloud server, which allows you to store and manage
            your OTP codes securely and accessibly from anywhere."
            image={otpManager}
            badgeText="iOS"
            buttonText="Install from Apple Store"
            buttonDisabled={true}
          />

          <AppCard
            title="OTP Manager"
            description="The OTP Manager extension, available on the Firefox Add-ons,
            securely manages your OTP codes with your personal Nextcloud
            server. With this extension, you can conveniently access all of
            your accounts, generate TOTP and HOTP codes and much more directly
            from Firefox."
            image={firefoxImage}
            badgeText="Firefox Extension"
            buttonText="Install from Firefox Add-ons"
            buttonDisabled={true}
          />

          <AppCard
            title="OTP Manager"
            description="The OTP Manager extension, available on the Chrome Web Store,
            securely manages your OTP codes with your personal Nextcloud
            server. With this extension, you can conveniently access all of
            your accounts, generate TOTP and HOTP codes and much more directly
            from many Chromium based Browsers."
            image={chromeImage}
            badgeText="Chrome Extension"
            buttonText="Install from Chrome Web Store"
            buttonDisabled={true}
          />
        </Stack>
      </ScrollArea.Autosize>
    </Modal>
  );
}
