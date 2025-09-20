import { faHome, faListCheck, faUsers, faDollarSign, faCogs, faWallet, faBell, faDatabase, faBuilding, faFile, faBahai, faBookAtlas, faCreditCard, faUser } from "@fortawesome/free-solid-svg-icons";

export const navLinks = {
  user: [
    {
      name: "dashboard",
      icon: faHome,
      link: "/",
      needsApproval: false,
    },
    {
      name: "services",
      icon: faDatabase,
      link: "services",
      needsApproval: true,
    },
    {
      name: "requests",
      icon: faListCheck,
      link: "requests",
      needsApproval: true,
    },
    {
      name: "profile",
      icon: faUser,
      link: "profile",
      needsApproval: true,
    }
  ],
};
