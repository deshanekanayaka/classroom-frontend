import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useTable } from "@refinedev/react-table";
import { useList } from "@refinedev/core";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ListView } from "@/components/refine-ui/views/list-view";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ShowButton } from "@/components/refine-ui/buttons/show";

import { Subject, User } from "types"

type ClassListItem = {
    id: number;
    name: string;
    status: "active" | "inactive";
    bannerUrl?: string;        // Optional — not every class may have a banner image
    subject?: {
        name: string;          // Nested object: the backend populates this via a relation
    };
    teacher?: {
        name: string;          // Nested object: the backend populates this via a relation
    };
    capacity: number;
};

const ClassesList = () => {

    const [searchQuery, setSearchQuery] = useState("");           // Bound to the text input
    const [selectedSubject, setSelectedSubject] = useState<string>("all");   // Bound to the subject <Select>
    const [selectedTeacher, setSelectedTeacher] = useState<string>("all");   // Bound to the teacher <Select>

    const classColumns = useMemo<ColumnDef<ClassListItem>[]>(
        () => [
            {
                id: "banner",
                accessorKey: "bannerUrl",
                size: 120,
                header: () => <p className="column-title ml-2">Banner</p>,
                cell: ({ getValue }) => {
                    const bannerUrl = getValue<string>();

                    return bannerUrl ? (
                        <img
                            src={bannerUrl}
                            alt="Class banner"
                            className="ml-2 h-10 w-10 rounded-md object-cover"
                            loading="lazy"   // Defers loading off-screen images for performance
                        />
                    ) : (
                        <span className="text-muted-foreground ml-2">No image</span>
                    );
                },
            },
            {
                id: "name",
                accessorKey: "name",
                size: 220,
                header: () => <p className="column-title">Class Name</p>,
                cell: ({ getValue }) => {
                    const className = getValue<string>();

                    return <span className="text-foreground">{className}</span>;
                },
            },
            {
                id: "status",
                accessorKey: "status",
                size: 140,
                header: () => <p className="column-title">Status</p>,
                cell: ({ getValue }) => {
                    const status = getValue<"active" | "inactive">();
                    const variant = status === "active" ? "default" : "secondary";

                    return <Badge variant={variant}>{status}</Badge>;
                },
            },
            {
                id: "subject",
                accessorKey: "subject.name",
                size: 200,
                header: () => <p className="column-title">Subject</p>,
                cell: ({ getValue }) => {
                    const subjectName = getValue<string>();

                    return subjectName ? (
                        <Badge variant="secondary">{subjectName}</Badge>
                    ) : (
                        <span className="text-muted-foreground">Not set</span>
                    );
                },
            },
            {

                id: "teacher",
                accessorKey: "teacher.name",
                size: 200,
                header: () => <p className="column-title">Teacher</p>,
                cell: ({ getValue }) => {
                    const teacherName = getValue<string>();

                    return teacherName ? (
                        <span className="text-foreground">{teacherName}</span>
                    ) : (
                        <span className="text-muted-foreground">Not assigned</span>
                    );
                },
            },
            {

                id: "capacity",
                accessorKey: "capacity",
                size: 120,
                header: () => <p className="column-title">Capacity</p>,
                cell: ({ getValue }) => {
                    const capacity = getValue<number>();

                    return <span className="text-foreground">{capacity}</span>;
                },
            },
            {
                // DETAILS / ACTIONS COLUMN
                // No accessorKey because this column doesn't display stored data —
                // it renders an action button. ShowButton navigates to the class
                // detail/show page (e.g. /classes/show/:id) using the row's id.
                id: "details",
                size: 140,
                header: () => <p className="column-title">Details</p>,
                cell: ({ row }) => (
                    <ShowButton
                        resource="classes"
                        recordItemId={row.original.id}
                        variant="outline"
                        size="sm"
                    >
                        View
                    </ShowButton>
                ),
            },
        ],
        [] // Empty dependency array: columns never need to be recomputed
    );

    // Fetches all subjects so the "Filter by subject" dropdown is populated
    const { query: subjectsQuery } = useList<Subject>({
        resource: "subjects",
        pagination: {
            pageSize: 100,
        },
    });

    // Fetches only users with role=teacher so the "Filter by teacher" dropdown
    // only shows teachers, not admins or students.
    const { query: teachersQuery } = useList<User>({
        resource: "users",
        filters: [
            {
                field: "role",
                operator: "eq",
                value: "teacher",
            },
        ],
        pagination: {
            pageSize: 100,
        },
    });

    // Safe fallback to empty arrays while the requests are loading
    const subjects = subjectsQuery.data?.data || [];
    const teachers = teachersQuery.data?.data || [];

    // ---------------------------------------------------------------------------
    // FILTER COMPOSITION
    // These three blocks translate the current UI state into the refine filter
    // format expected by useTable. They are recomputed whenever state changes.
    //
    // When a filter is set to "all" (default), an empty array is returned so
    // no filter is applied for that field. When a value is selected, a single
    // filter object is returned for that field.
    //
    // All three arrays are then spread into the `permanent` filters array below,
    // which means they are always active (not clearable by the user via the table UI).
    // The backend (data.ts) is responsible for mapping these field names to the
    // correct query params — e.g. field "subject" → ?subject=Math.
    // ---------------------------------------------------------------------------

    // Sends ?subject=<name> to the backend when a subject is selected
    const subjectFilters =
        selectedSubject === "all"
            ? []
            : [
                {
                    field: "subject",
                    operator: "eq" as const,
                    value: selectedSubject,
                },
            ];

    // Sends ?teacher=<name> to the backend when a teacher is selected
    const teacherFilters =
        selectedTeacher === "all"
            ? []
            : [
                {
                    field: "teacher",
                    operator: "eq" as const,
                    value: selectedTeacher,
                },
            ];

    // Sends ?name_contains=<query> (or similar) when the user types in the search box.
    // Only applied when searchQuery is non-empty to avoid sending an empty filter.
    const searchFilters = searchQuery
        ? [
            {
                field: "name",
                operator: "contains" as const,
                value: searchQuery,
            },
        ]
        : [];

    // ---------------------------------------------------------------------------
    // TABLE SETUP — useTable (refine + TanStack Table)
    // useTable wires together TanStack Table (for rendering) and refine (for
    // data fetching). Whenever pagination, filters, or sorters change, refine
    // automatically fires a new request to the "classes" resource.
    //
    // `permanent` filters cannot be cleared via the table UI — they stay active
    // as long as the composed filter arrays above are non-empty, which is exactly
    // what we want for our controlled filter controls.
    //
    // The initial sorter orders results newest-first (id desc), consistent with
    // SubjectsList's default sort.
    // ---------------------------------------------------------------------------
    const classesTable = useTable<ClassListItem>({
        columns: classColumns,
        refineCoreProps: {
            resource: "classes",
            pagination: {
                pageSize: 10,
                mode: "server",   // Pagination is handled by the backend, not client-side
            },
            filters: {
                // Spread all three filter arrays together. An empty array contributes
                // nothing, so inactive filters are effectively a no-op.
                permanent: [...subjectFilters, ...teacherFilters, ...searchFilters],
            },
            sorters: {
                initial: [
                    {
                        field: "id",
                        order: "desc",  // Show most recently created classes first
                    },
                ],
            },
        },
    });

    // ---------------------------------------------------------------------------
    // RENDER
    // The layout mirrors SubjectsList exactly:
    //   ListView (page wrapper) → Breadcrumb → title → intro row with controls → DataTable
    //
    // The "intro-row" / "actions-row" CSS classes are shared utility classes
    // that keep the header layout consistent across all list pages in this project.
    // ---------------------------------------------------------------------------
    return (
        <ListView>
            {/* Renders the breadcrumb trail, e.g. Home > Classes */}
            <Breadcrumb />
            <h1 className="page-title">Classes</h1>

            {/* Row containing a description on the left and all action controls on the right */}
            <div className="intro-row">
                <p>Quick access to essential metrics and management tools.</p>

                {/* Actions row: search input + subject filter + teacher filter + create button */}
                <div className="actions-row">

                    {/* Search input — updates searchQuery state on every keystroke,
                        which recomposes searchFilters and triggers a new table fetch */}
                    <div className="search-field">
                        <Search className="search-icon" />
                        <Input
                            type="text"
                            placeholder="Search by name..."
                            className="pl-10 w-full"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">

                        {/* Subject filter dropdown — populated from the useList subjects fetch above.
                            Selecting a value updates selectedSubject state → recomposes subjectFilters */}
                        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by subject" />
                            </SelectTrigger>

                            <SelectContent>
                                {/* "all" is the reset/default value — clears the subject filter */}
                                <SelectItem value="all">All Subjects</SelectItem>
                                {subjects.map((subject) => (
                                    <SelectItem key={subject.id} value={subject.name}>
                                        {subject.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Teacher filter dropdown — populated from the role=teacher useList fetch.
                            Works identically to the subject filter above */}
                        <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by teacher" />
                            </SelectTrigger>

                            <SelectContent>
                                {/* "all" is the reset/default value — clears the teacher filter */}
                                <SelectItem value="all">All Teachers</SelectItem>
                                {teachers.map((teacher) => (
                                    <SelectItem key={teacher.id} value={teacher.name}>
                                        {teacher.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* CreateButton with resource="classes" navigates to /classes/create.
                            Specifying the resource explicitly is required here because this
                            component is not rendered inside a refine <Resource> context that
                            would infer it automatically. */}
                        <CreateButton resource="classes" />
                    </div>
                </div>
            </div>

            {/* DataTable receives the fully configured table instance from useTable.
                It handles rendering rows, pagination controls, loading states, and
                empty states internally — we just pass the table object through. */}
            <DataTable table={classesTable} />
        </ListView>
    );
};

export default ClassesList;