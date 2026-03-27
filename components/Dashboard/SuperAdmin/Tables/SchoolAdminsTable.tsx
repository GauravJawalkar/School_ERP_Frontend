"use client"
import React, { useEffect, useRef, useState } from 'react'
import { CanAccess } from '@/components/Auth/CanAccess'
import { Ban, Check, CircleCheckBig, CirclePlus, CircleQuestionMark, ChevronDown, Pencil, Settings2, ShieldAlert, Trash2, UserCog, UserRound, BadgeCheck, BadgeX, Plus, AlertTriangle } from 'lucide-react'
import Link from 'next/link';
import TableActionMenu from '@/components/Commons/TableActionMenu';
import { ApiClient } from '@/interceptors/ApiClient';
import { BASE_URL } from '@/constants/constants';
import { useQuery } from '@tanstack/react-query';
import { schoolAdminsApi } from '@/interfaces/interface';
import TableSkeleton from '@/components/Commons/Skeletons/TableSkeleton';
import ErrorFallback from '@/components/Commons/Errors/ErrorFallback';
import { useRouter } from 'next/navigation';

const tableColumns = ['School Name', 'Email', 'Phone', 'Affiliation No', 'Status', 'City', 'Admin']

const SchoolAdminsTable = () => {
    const [visibleColumns, setVisibleColumns] = useState(new Set(tableColumns));
    const [open, setOpen] = useState(false);
    const [expandedSchool, setExpandedSchool] = useState<number | null>(null);
    const dropDownRef = useRef<HTMLDivElement>(null)
    const router = useRouter();

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

    const toggleAdminDrawer = (schoolId: number) => {
        setExpandedSchool(prev => prev === schoolId ? null : schoolId);
    }

    const isVisible = (col: string) => visibleColumns.has(col);

    // Keeping it up so no confilict arise at runtime
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

    const getSchoolAdmins = async () => {
        const response = await ApiClient.get(`${BASE_URL}/admin/allAdmins`);
        return response.data?.data;
    }

    const { data: schoolAdmins = [], isFetching, isError, refetch, error } = useQuery({
        queryKey: ['getSchoolAdmis'],
        queryFn: getSchoolAdmins,
        refetchOnWindowFocus: false,
    })

    if (isError) {
        console.error("Error fetching schoolAdmins  : ", error.message);
        return <ErrorFallback refetch={refetch} title={'School Admins'} />
    }

    const totalColumns = visibleColumns.size + 2;

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
                        <button
                            onClick={() => router.push("/schools/new")}
                            disabled={isFetching || isError}
                            className='flex items-center justify-center gap-1.5 text-sm font-medium px-3 py-1.5 border border-light-border border-dashed rounded-lg hover:bg-gray-100 text-black transition-all ease-linear disabled:cursor-not-allowed'>
                            <CirclePlus size={15} />
                            Add Admin
                        </button>
                        <div ref={dropDownRef} className='relative group'>
                            <button
                                onClick={toggleDropDown}
                                disabled={isFetching || isError}
                                className='flex items-center justify-center gap-1.5 text-sm font-medium px-3 py-1.5 border border-light-border rounded-lg hover:bg-black/70 bg-black text-white transition-all ease-linear disabled:cursor-not-allowed'>
                                <Settings2 size={15} />
                                View
                            </button>
                            {open && (
                                <div className='absolute right-0 top-full mt-1.5 w-max bg-white rounded-md shadow-lg border border-light-border transition-all ease-linear text-sm z-10'>
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
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Table */}
                {isFetching ? <TableSkeleton rows={6} columns={6} /> : <div className='border-light-border rounded-xl border w-full overflow-x-auto slim-scrollbar'>
                    <table className="text-sm min-w-max w-full">
                        <thead className="text-left hover:bg-gray-50 transition-all ease-linear">
                            <tr className="text-black/80">
                                <th className="pl-4 py-2.5 font-medium">
                                    <input
                                        className='h-3.5 w-3.5 rounded-lg border-light-border accent-black'
                                        type="checkbox" />
                                </th>
                                {tableColumns.map((column) => (
                                    isVisible(column) && <th key={column} className="px-4 font-medium">{column}</th>
                                ))}
                                <th className="px-4 font-medium"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {schoolAdmins?.map((school: schoolAdminsApi, index: number) => {
                                const isExpanded = expandedSchool === school.schoolId;
                                const statusIcon =
                                    school?.schoolStatus.toLowerCase() === "active" ? <CircleCheckBig size={17} /> :
                                        school?.schoolStatus.toLowerCase() === "expired" ? <ShieldAlert size={17} /> :
                                            <CircleQuestionMark size={17} />;

                                return (
                                    // ✅ Fix 1: key on React.Fragment, not on the inner <tr>
                                    <React.Fragment key={school.schoolId}>

                                        {/* Main Row */}
                                        <tr className="border-t border-light-border hover:bg-gray-50 transition">
                                            <td className="pl-4 py-3">
                                                <input
                                                    className='h-3.5 w-3.5 rounded-lg border-light-border accent-black'
                                                    type="checkbox" />
                                            </td>
                                            {isVisible('School Name') && (
                                                <td className="px-4 text-black/70">
                                                    <Link className='hover:text-black transition-all hover:font-medium'
                                                        href={`/schools/${school.schoolSlug}`}>
                                                        {school.schoolName}
                                                    </Link>
                                                </td>
                                            )}
                                            {isVisible('Email') && (
                                                <td className="px-4 text-black/70">
                                                    <Link className='hover:text-black transition-all hover:font-medium' href={`mailTo:${school?.schoolInfo?.emails?.primary}`}>
                                                        {school?.schoolInfo?.emails?.primary}
                                                    </Link>
                                                </td>
                                            )}
                                            {isVisible('Phone') && (
                                                <td className="px-4 text-black/70">
                                                    <Link className='hover:text-black transition-all hover:font-medium' href={`tel:${school?.schoolInfo?.main_phone}`}>
                                                        {school?.schoolInfo?.main_phone}
                                                    </Link>
                                                </td>
                                            )}
                                            {isVisible('Affiliation No') && (
                                                <td className="px-4">
                                                    <span className="text-sm text-black/70" title={school.affiliationNumber}>
                                                        {String(school.affiliationNumber).slice(
                                                            0,
                                                            Math.floor(String(school.affiliationNumber).length / 2)
                                                        )}...
                                                    </span>
                                                </td>
                                            )}
                                            {isVisible('Status') && (
                                                <td className="px-4">
                                                    <span className="py-1 rounded-md flex items-center gap-2 text-black/70">
                                                        {statusIcon}
                                                        <span title={school.schoolStatus} className='text-sm line-clamp-1 capitalize'>
                                                            {school.schoolStatus.toLocaleLowerCase()}
                                                        </span>
                                                    </span>
                                                </td>
                                            )}
                                            {isVisible('City') && (
                                                <td className="px-4 text-black/70">{school.schoolInfo?.address_details?.city}</td>
                                            )}
                                            {isVisible('Admin') && (
                                                <td className="px-4 text-black/70">
                                                    {school.admins?.length > 0 ? (
                                                        <button
                                                            type='button'
                                                            onClick={() => toggleAdminDrawer(school.schoolId)}
                                                            className='flex items-center gap-1 bg-gray-200/60 px-1.5 py-0.5 rounded-sm hover:text-black cursor-pointer transition-all outline-none focus:outline-none'>
                                                            View
                                                            <ChevronDown
                                                                size={13}
                                                                className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                                                            />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type='button'
                                                            className='flex items-center gap-1 bg-gray-200/60 px-1.5 py-0.5 rounded-sm hover:text-black cursor-pointer transition-all outline-none focus:outline-none'>
                                                            Add
                                                            <Plus size={13} />
                                                        </button>
                                                    )}
                                                </td>
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
                                                            label: "Add Admins",
                                                            icon: <UserCog size={15} />,
                                                            onClick: () => toggleAdminDrawer(school.schoolId),
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

                                        {/* Expandable Admin Drawer Row */}
                                        {isExpanded && (
                                            <tr className="border-t border-light-border">
                                                <td colSpan={totalColumns} className="bg-gray-50/60 px-6 py-3">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <UserCog size={14} className="text-black/40" />
                                                        <span className="text-xs font-medium text-black/40 uppercase tracking-wide">
                                                            Admins —
                                                        </span>
                                                        <span className="text-xs text-black/40 bg-gray-200/70 px-1.5 py-0.5 rounded-xs">
                                                            Total : {school.admins.length}
                                                        </span>
                                                    </div>

                                                    <div className="border border-light-border rounded-lg overflow-hidden">
                                                        <table className="text-xs w-full">
                                                            <thead>
                                                                <tr className="bg-gray-50 border-b border-light-border text-left text-black/50">
                                                                    <th className="px-2.5 py-2 font-medium">Name</th>
                                                                    <th className="px-2.5 py-2 font-medium">Email</th>
                                                                    <th className="px-2.5 py-2 font-medium">Phone</th>
                                                                    <th className="px-2.5 py-2 font-medium">Status</th>
                                                                    <th className="px-2.5 py-2 font-medium">Assigned On</th>
                                                                    <th className="px-2.5 py-2 font-medium"></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="bg-white divide-y divide-light-border">
                                                                {school.admins.map((admin) => (
                                                                    <tr key={admin.userId} className="hover:bg-gray-50 transition-all">
                                                                        <td className="px-2.5 py-2.5">
                                                                            <div className="flex items-center gap-2">
                                                                                <div className="h-6 w-6 rounded-full bg-gray-100 border border-light-border flex items-center justify-center text-black/40 shrink-0">
                                                                                    <UserRound size={12} />
                                                                                </div>
                                                                                <span className="font-medium text-black/70">
                                                                                    {admin.firstName} {admin.lastName}
                                                                                </span>
                                                                            </div>
                                                                        </td>
                                                                        <td className="px-2.5 py-2.5">
                                                                            <Link href={`mailto:${admin.email}`} className="text-black/60 hover:text-black transition-all">
                                                                                {admin.email}
                                                                            </Link>
                                                                        </td>
                                                                        <td className="px-2.5 py-2.5">
                                                                            <Link href={`tel:${admin.phone}`} className="text-black/60 hover:text-black transition-all">
                                                                                {admin.phone}
                                                                            </Link>
                                                                        </td>
                                                                        <td className="px-2.5 py-2.5">
                                                                            <span className={`flex items-center gap-1 w-fit px-1.5 py-0.5 rounded-sm ${admin.isActive ? 'bg-gray-100 text-black/60' : 'bg-gray-100 text-black/40'}`}>
                                                                                {admin.isActive
                                                                                    ? <><BadgeCheck size={11} /> Active</>
                                                                                    : <><BadgeX size={11} /> Inactive</>
                                                                                }
                                                                            </span>
                                                                        </td>
                                                                        <td className="px-2.5 py-2.5 text-black/50">
                                                                            {new Date(admin.assignedAt).toLocaleDateString('en-IN', {
                                                                                day: 'numeric',
                                                                                month: 'short',
                                                                                year: 'numeric'
                                                                            })}
                                                                        </td>
                                                                        <td className="px-2.5 py-2.5">
                                                                            <button
                                                                                type="button"
                                                                                className="bg-gray-200/60 px-1.5 py-0.5 rounded-sm hover:text-black text-black/60 cursor-pointer transition-all">
                                                                                Manage
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>}
            </div>
        </CanAccess>
    )
}

export default SchoolAdminsTable