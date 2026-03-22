"use client"
import { useEffect, useRef, useState } from 'react'
import { CanAccess } from '@/components/Auth/CanAccess'
import { institutes } from '@/data/dummySuperAdminStats';
import { Ban, Check, CircleCheckBig, CirclePlus, CircleQuestionMark, Pencil, Settings2, ShieldAlert, Trash2, UserCog } from 'lucide-react'
import Link from 'next/link';
import TableActionMenu from '@/components/Commons/TableActionMenu';

const tableColumns = ['School Name', 'City', 'Email', 'Phone', 'Students', 'Staff', 'Plan', 'Revenue', 'Status', 'Renewal Date', 'Last Login']

const SchoolAdminsTable = () => {
    const [visibleColumns, setVisibleColumns] = useState(new Set(tableColumns));
    const [open, setOpen] = useState(false);
    const dropDownRef = useRef<HTMLDivElement>(null)

    const toggleColumn = (column: string) => {
        setVisibleColumns(prev => {
            const next = new Set(prev);
            next.has(column) ? next.delete(column) : next.add(column);
            return next;
        });
    };

    const toggleDropDown = () => {
        if (!dropDownRef.current) return
        setOpen((prev) => !prev);
    }

    const isVisible = (col: string) => visibleColumns.has(col);

    const slugify = (schoolName: string) => schoolName.toLowerCase().replace(/\s+/g, '-');

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            const target = event.target as Node
            if (!target?.isConnected) return
            if (dropDownRef.current && !dropDownRef.current.contains(target)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            document.removeEventListener("touchstart", handleClickOutside)
        }
    }, [])

    return (
        <CanAccess permission='saas.institute.create'>
            <div className='border-light-border border p-4 rounded-xl'>
                <div className='py-1 text-lg font-medium text-black/80'>
                    <p>School Admins</p>
                </div>
                <div className='flex items-center justify-between py-3'>
                    <div>
                        <input
                            className='border border-input-border text-sm px-3 py-1.5 outline-none rounded-md font-medium focus:shadow focus:ring-2 focus:ring-neutral-400/50 min-w-xs'
                            type="text"
                            placeholder='Filter Schools ....' />
                    </div>
                    <div className='flex items-center gap-2'>
                        <Link href={'/schools/new'} className='flex items-center justify-center gap-1.5 text-sm font-medium px-3 py-1.5 border border-light-border border-dashed rounded-lg hover:bg-gray-100 text-black transition-all ease-linear'>
                            <CirclePlus size={15} />
                            Add Admin
                        </Link>
                        <div ref={dropDownRef} className='relative group'>
                            <button onClick={toggleDropDown} className='flex items-center justify-center gap-1.5 text-sm font-medium px-3 py-1.5 border border-light-border rounded-lg hover:bg-black/70 bg-black text-white transition-all ease-linear'>
                                <Settings2 size={15} />
                                View
                            </button>
                            {/* Dropdown */}
                            {open && <div className='absolute right-0 top-full mt-1.5 w-max bg-white rounded-md shadow-lg border border-light-border transition-all ease-linear text-sm z-10'>
                                <h1 className='py-2 border-b text-center border-light-border font-medium'>Toggle columns</h1>
                                <div className='max-h-50 overflow-y-auto slim-scrollbar py-1'>
                                    {tableColumns.map((column) => (
                                        <label
                                            key={column}
                                            onClick={() => toggleColumn(column)}
                                            className='flex items-center gap-2 text-sm text-black/70 hover:text-black font-normal p-1.5 hover:bg-gray-100 rounded-md mx-1.5 cursor-pointer select-none'>
                                            {isVisible(column)
                                                ? <Check size={15} className="text-black" />
                                                : <span className="inline-block w-3.75" />
                                            }
                                            {column}
                                        </label>
                                    ))}
                                </div>
                            </div>}
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className='border-light-border rounded-xl border w-full overflow-x-auto overflow-y-visible slim-scrollbar'>
                    <table className="text-sm min-w-max w-full">
                        <thead className="text-left hover:bg-gray-50 transition-all ease-linear">
                            <tr className="text-black/80">
                                <th className="pl-4 py-2.5 font-medium">
                                    <input
                                        className='h-3.5 w-3.5 rounded-lg border-light-border accent-black'
                                        type="checkbox" />
                                </th>
                                {
                                    tableColumns.map((column) => (
                                        isVisible(column) && <th key={column} className="px-4 font-medium">{column}</th>
                                    ))
                                }
                                <th className="px-4 font-medium"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {institutes.map((institute) => {
                                const statusIcon =
                                    institute.status === "Active" ? <CircleCheckBig size={17} /> :
                                        institute.status === "Expired" ? <ShieldAlert size={17} /> :
                                            <CircleQuestionMark size={17} />;
                                return (
                                    <tr key={institute.id} className="border-t border-light-border hover:bg-gray-50 transition">
                                        <td className="pl-4 py-3">
                                            <input
                                                className='h-3.5 w-3.5 rounded-lg border-light-border accent-black'
                                                type="checkbox" />
                                        </td>
                                        {isVisible('School Name') && (
                                            <td className="px-4 text-black/70">
                                                <Link className='hover:text-black transition-all hover:font-medium' href={`/schools/${slugify(institute?.name)}`}>
                                                    {institute.name}
                                                </Link>
                                            </td>
                                        )}
                                        {isVisible('City') && (
                                            <td className="px-4 text-black/70">{institute.city}</td>
                                        )}
                                        {isVisible('Email') && (
                                            <td className="px-4 text-black/70">
                                                <Link className='hover:text-black transition-all hover:font-medium' href={`mailTo:${institute?.email}`}>
                                                    {institute.email}
                                                </Link>
                                            </td>
                                        )}
                                        {isVisible('Phone') && (
                                            <td className="px-4 text-black/70">
                                                <Link className='hover:text-black transition-all hover:font-medium' href={`tel:${institute.phone}`}>
                                                    {institute.phone}
                                                </Link>
                                            </td>
                                        )}
                                        {isVisible('Students') && (
                                            <td className="px-4 text-black/70">{institute.students.toLocaleString()}</td>
                                        )}
                                        {isVisible('Staff') && (
                                            <td className="px-4 text-black/70">{institute.staff.toLocaleString()}</td>
                                        )}
                                        {isVisible('Plan') && (
                                            <td className="px-4">
                                                <span className="text-sm text-black/70">{institute.plan}</span>
                                            </td>
                                        )}
                                        {isVisible('Revenue') && (
                                            <td className="px-4 text-black/70">{institute.revenueGenerated.toLocaleString()}</td>
                                        )}
                                        {isVisible('Status') && (
                                            <td className="px-4">
                                                <span className="py-1 rounded-md flex items-center gap-2 text-black/70">
                                                    {statusIcon}
                                                    <span title={institute.status} className='text-sm line-clamp-1'>{institute.status}</span>
                                                </span>
                                            </td>
                                        )}
                                        {isVisible('Renewal Date') && (
                                            <td className="px-4 text-black/70">{institute.renewalDate}</td>
                                        )}
                                        {isVisible('Last Login') && (
                                            <td className="px-4 text-black/70">{institute.lastLogin}</td>
                                        )}
                                        <td className="px-4">
                                            <TableActionMenu
                                                actions={[
                                                    {
                                                        label: "Edit",
                                                        icon: <Pencil size={15} />,
                                                        onClick: () => console.log("Edit School"),
                                                    },
                                                    {
                                                        label: "Admins",
                                                        icon: <UserCog size={15} />,
                                                        onClick: () => console.log("View Admins"),
                                                    },
                                                    {
                                                        label: "Suspend",
                                                        icon: <Ban size={15} />,
                                                        onClick: () => console.log("Suspend School"),
                                                    },
                                                    {
                                                        label: "Delete",
                                                        icon: <Trash2 size={15} />,
                                                        danger: true,
                                                        onClick: () => console.log("Delete School"),
                                                    },
                                                ]}
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </CanAccess>
    )
}

export default SchoolAdminsTable