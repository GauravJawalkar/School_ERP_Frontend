import { NavGroup, NavItem } from "@/interfaces/interface";
import { usePermission } from "./usePermission";
import { useMemo } from "react";
import { navConfig } from "@/lib/configs/nav-config";

// Helper function to check if a nav item should be accessible based on its permission/module/role requirements
export function canAccessNavItem(
    item: NavItem,
    checks: {
        can: (p: string) => boolean;
        hasModule: (m: string) => boolean;
        is: (r: string) => boolean;
    }
): boolean {
    const { can, hasModule, is } = checks;

    if (item.role && !is(item.role)) return false;
    if (item.permission && !can(item.permission)) return false;
    if (item.module && !hasModule(item.module)) return false;

    return true;
}

// Custom hook to get the sidebar navigation config filtered by user permissions
export function useSidebarNav(): NavGroup[] {
    const { can, hasModule, is } = usePermission();

    return useMemo(() => {
        return navConfig
            .map((group) => ({
                ...group,
                items: group.items
                    .filter((item) => canAccessNavItem(item, { can, hasModule, is })) // Filter top-level items 
                    .map((item) => ({
                        ...item,
                        children: item.children?.filter((child) =>
                            canAccessNavItem(child, { can, hasModule, is })  // Filter children of each item 
                        ),
                    })),
            }))
            .filter((group) => group.items.length > 0) // Remove groups where all items were filtered out 
    }, [can, hasModule, is]);
}


//  USAGE IN SIDEBAR COMPONENT
//
// "use client";
// import { useSidebarNav } from "@/hooks/useSidebarNav";
//
// export function Sidebar() {
//   const navGroups = useSidebarNav();
//
//   return (
//     <nav>
//       {navGroups.map((group) => (
//         <div key={group.groupLabel}>
//           <p className="text-xs text-gray-400 uppercase">{group.groupLabel}</p>
//           {group.items.map((item) => (
//             <NavLink key={item.href} href={item.href}>
//               {item.label}
//             </NavLink>
//           ))}
//         </div>
//       ))}
//     </nav>
//   );
// }