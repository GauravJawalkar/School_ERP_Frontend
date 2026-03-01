import { CanAccess } from '@/components/Auth/CanAccess'
import { institutes } from '@/data/dummySuperAdminStats';
import { CircleCheckBig, CirclePlus, CircleQuestionMark, Ellipsis, Settings2, ShieldAlert } from 'lucide-react'


const InstituteList = () => {
    return (
        <CanAccess permission='saas.institute.create'>
            <div className='border-light-border border p-4 rounded-xl'>
                <div className='py-1 text-lg font-medium text-black/80'>
                    <p>Schools And Institutes Enrolled</p>
                </div>
                <div className='flex items-center justify-between py-3'>
                    <div>
                        <input
                            className='border border-input-border text-sm px-3 py-1.5 outline-none rounded-md font-medium focus:shadow focus:ring-2 focus:ring-neutral-400/50 min-w-xs'
                            type="text"
                            placeholder='Filter Schools....' />
                    </div>
                    <div className='flex items-center gap-2'>
                        <button className='flex items-center justify-center gap-2 text-sm font-medium px-3 py-1.5 border border-light-border border-dashed rounded-lg hover:bg-gray-100 text-black transition-all ease-linear '>
                            <CirclePlus size={15} />
                            Status
                        </button>
                        <button className='flex items-center justify-center gap-2 text-sm font-medium px-3 py-1.5 border border-light-border rounded-lg hover:bg-black/70 bg-black text-white transition-all ease-linear'>
                            <Settings2 size={15} />
                            View
                        </button>
                    </div>
                </div>
                {/* Table mapping all the schools data */}
                <div className='border-light-border rounded-xl border w-full overflow-x-auto slim-scrollbar'>
                    <table className="text-sm min-w-max w-full">
                        <thead className="text-left hover:bg-gray-50 transition-all ease-linear">
                            <tr className="text-black/80">
                                <th className="pl-4 py-2.5 font-medium">
                                    <input
                                        className='h-3.5 w-3.5 rounded-lg border-light-border accent-black '
                                        type="checkbox" name="" id="" />
                                </th>
                                <th className="px-4 font-medium">School</th>
                                <th className="px-4 font-medium">Email</th>
                                <th className="px-4 font-medium">Phone (+91)</th>
                                <th className="px-4 font-medium">Location</th>
                                <th className="px-4 font-medium">Students</th>
                                <th className="px-4 font-medium">Plan</th>
                                <th className="px-4 font-medium">Status</th>
                                <th className="px-4 font-medium">Last Login</th>
                                <th className="px-4 font-medium"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {institutes.map((inst) => {

                                const statusIcon = inst.status === "Active" ? <CircleCheckBig size={17} /> : inst.status === "Expired" ? <ShieldAlert size={17} /> : <CircleQuestionMark size={17} />;

                                return (
                                    <tr key={inst.id} className="border-t border-light-border hover:bg-gray-50 transition">
                                        {/* Institute + logo */}
                                        <td className="pl-4 py-3">
                                            <div>
                                                <input
                                                    className='h-3.5 w-3.5 rounded-lg border-light-border accent-black'
                                                    type="checkbox"
                                                    name=""
                                                    id="" />
                                            </div>
                                        </td>
                                        {/* Name */}
                                        <td className="px-4 text-black/70 ">
                                            {inst.name}
                                        </td>

                                        {/* Email */}
                                        <td className="px-4 text-black/70">
                                            {inst.email}
                                        </td>

                                        {/* Phone */}
                                        <td className="px-4 text-black/70">
                                            {inst.phone}
                                        </td>

                                        {/* Location */}
                                        <td className="px-4 text-black/70">
                                            {inst.city}
                                        </td>

                                        {/* Students */}
                                        <td className="px-4 text-black/70">
                                            {inst.students.toLocaleString()}
                                        </td>

                                        {/* Plan */}
                                        <td className="px-4">
                                            <span className="text-sm text-black/70">
                                                {inst.plan}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-4">
                                            <span className={`px-2 py-1 rounded-md flex items-center gap-2 text-black/70`}>
                                                {statusIcon} <span title={inst.status} className='text-sm line-clamp-1'>{inst.status}</span>
                                            </span>
                                        </td>

                                        {/* Last login */}
                                        <td className="px-4 text-black/70">
                                            {inst.lastLogin}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4">
                                            <button className='text-black/70 hover:text-black transition ease-linear hover:bg-gray-100/90 p-1.5 rounded-md hover:ring-light-border hover:ring-1'>
                                                <Ellipsis size={15} />
                                            </button>
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

export default InstituteList