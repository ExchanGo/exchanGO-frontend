"use client";

import { useModal } from "@/store/modals";
import FilterModal from "./filter-modal";
import ShareExchangeModal from "./share-exchange-modal";

export default function ModalContainerSearch() {
  const { type } = useModal();

  return (
    <div className="fixed inset-0 z-[-10]">
      {type === "MODAL_FILTER_CURRENCY" && <FilterModal />}
      {type === "MODAL_SHARE_EXCHANGE" && <ShareExchangeModal />}
    </div>
  );
}
