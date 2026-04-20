export type SourcingPartner = {
  name: string;
  focusKey: "dealerInventory" | "johnDeereDealer" | "farmAuction" | "usedEquipmentSales";
};

export const SOURCING_PARTNERS: SourcingPartner[] = [
  { name: "Randall Bros", focusKey: "dealerInventory" },
  { name: "Sloan Implement", focusKey: "johnDeereDealer" },
  { name: "Mowrey Auction", focusKey: "farmAuction" },
  { name: "Pfeifer's Machinery Sales", focusKey: "usedEquipmentSales" },
];
