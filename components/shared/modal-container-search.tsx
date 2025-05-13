"use client";

import { useModal } from "@/store/modals";
import dynamic from "next/dynamic";

// Dynamically import modals with SSR disabled
const FilterModal = dynamic(() => import("./filter-modal"), { ssr: false });
const ShareExchangeModal = dynamic(() => import("./share-exchange-modal"), {
  ssr: false,
});
const WhatsAppAlertModal = dynamic(() => import("./whatsapp-alert-modal"), {
  ssr: false,
});

export default function ModalContainerSearch() {
  const { type } = useModal();

  return (
    <div className="fixed inset-0 z-[-10]">
      {type === "MODAL_FILTER_CURRENCY" && <FilterModal />}
      {type === "MODAL_SHARE_EXCHANGE" && <ShareExchangeModal />}
      {type === "MODAL_WHATSAPP_ALERT" && <WhatsAppAlertModal />}
    </div>
  );
}
