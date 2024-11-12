import { Button, useDisclosure } from "@chakra-ui/react";
import {
  MdOutlineRefresh,
  MdArrowBack,
  MdEdit,
  MdDeleteOutline,
  MdOutlineVisibility,
} from "react-icons/md";
import Loading from "../ui/Loading";
import { useDispatch, useSelector } from "react-redux";
import {
  closeAddCustomersDrawer,
  closeEditCustomersDrawer,
  closeShowDetailsCustomersDrawer,
  closeShowDetailsUsersDrawer,
  openAddCustomersDrawer,
  openEditCustomersDrawer,
  openShowDetailsCustomersDrawer,
  openShowDetailsUsersDrawer,
} from "../../redux/reducers/misc";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { FcDatabase } from "react-icons/fc";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import moment from "moment";

import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { usePagination, useSortBy, useTable } from "react-table";
import ClickMenu from "../ui/ClickMenu";
import CustomersEditDrawer from "../ui/Drawers/Edit Drawers/CustomersEditDrawer";
import CustomersDetailsDrawer from "../ui/Drawers/Details Drawers/CustomersDetailsDrawer";
import CustomersDrawer from "../ui/Drawers/Add Drawers/CustomersDrawer";
import UserDetailsDrawer from "../ui/Drawers/Details Drawers/UsersDetailsDrawer";

const columns = [
  {
    Header: "Created On",
    accessor: "created_on",
  },
  {
    Header: "Account Type",
    accessor: "account_name",
  },
  {
    Header: "Account Status",
    accessor: "account_status",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Phone",
    accessor: "phone",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Company",
    accessor: "company",
  },
  {
    Header: "City",
    accessor: "city",
  },
  {
    Header: "No. of Employees",
    accessor: "employeeCount",
  },
];

const Users = () => {
  const [dataId, setDataId] = useState();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const { role, allowedroutes } = useSelector((state) => state.auth);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    state: { pageIndex },
    pageCount,
  } = useTable({ columns, data: filteredData }, useSortBy, usePagination);
  const dispatch = useDispatch();

  const { showDetailsUsersDrawerIsOpened } = useSelector((state) => state.misc);

  const statusStyles = {
    inactive: {
      bg: "rgb(255, 127, 80)",
      text: "#fff",
    },
    active: {
      bg: "rgb(0, 100, 0)",
      text: "#fff",
    },
  };

  const fetchAllUsers = async (req, res) => {
    try {
      const url = process.env.REACT_APP_CRM_BACKEND_URL + "user/all";
      const response = await fetch(url);
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      setUsers(data.users);
      setFilteredData(data.users);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const showDetailsHandler = (id) => {
    setDataId(id);
    dispatch(openShowDetailsUsersDrawer());
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  useEffect(() => {
    if (searchKey.trim() !== "") {
      const searchedData = users.filter(
        (d) =>
          d?.name?.toLowerCase().includes(searchKey.toLowerCase()) ||
          d?.email?.toLowerCase().includes(searchKey.toLowerCase()) ||
          d?.phone?.toLowerCase().includes(searchKey.toLowerCase()) ||
          d?.organization?.account?.account_name?.toLowerCase().includes(searchKey.toLowerCase()) ||
          d?.organization?.account?.account_status?.toLowerCase().includes(searchKey.toLowerCase()) ||
          d?.organization?.company?.toLowerCase().includes(searchKey.toLowerCase()) ||
          d?.organization?.city?.toLowerCase().includes(searchKey.toLowerCase()) ||
          d?.organization?.employeeCount?.toString()?.toLowerCase().includes(searchKey.toLowerCase()) ||
          d?.phone?.toLowerCase().includes(searchKey.toLowerCase()) ||
          (d?.createdAt &&
            new Date(d?.createdAt)
              ?.toISOString()
              ?.substring(0, 10)
              ?.split("-")
              .reverse()
              .join("")
              ?.includes(searchKey.replaceAll("/", "")))
      );
      setFilteredData(searchedData);
    } else {
      setFilteredData(users);
    }
  }, [searchKey]);

  return (
    <>
      {role !== "Super Admin" && !allowedroutes.includes("user") && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-bold text-[#ff6f6f]">
          You do not have access to this route. Contact your Super Admin for
          further action.
        </div>
      )}

      {(role === "Super Admin" || allowedroutes.includes("user")) && (
        <div
          className="border-[1px] px-2 py-8 md:px-9 rounded"
          style={{ boxShadow: "0 0 20px 3px #96beee26" }}
        >
          <div>
            <div className="flex flex-col items-start justify-start md:flex-row gap-y-1 md:justify-between md:items-center mb-8">
              <div className="flex text-lg md:text-xl font-semibold items-center gap-y-1">
                User List
              </div>

              <div className="mt-2 md:mt-0 flex flex-wrap gap-y-1 gap-x-2 w-full md:w-fit">
                <textarea
                  className="rounded-[10px] w-full md:flex-1 px-2 py-2 md:px-3 md:py-2 text-sm focus:outline-[#1640d6] hover:outline:[#1640d6] border resize-none"
                  rows="1"
                  width="220px"
                  placeholder="Search"
                  value={searchKey}
                  onChange={(e) => setSearchKey(e.target.value)}
                />
                <Button
                  fontSize={{ base: "14px", md: "14px" }}
                  paddingX={{ base: "10px", md: "12px" }}
                  paddingY={{ base: "0", md: "3px" }}
                  width={{ base: "-webkit-fill-available", md: 100 }}
                  onClick={fetchAllUsers}
                  leftIcon={<MdOutlineRefresh />}
                  color="#1640d6"
                  borderColor="#1640d6"
                  variant="outline"
                >
                  Refresh
                </Button>
              </div>
            </div>

            <div>
              {showDetailsUsersDrawerIsOpened && (
                <ClickMenu
                  top={0}
                  right={0}
                  closeContextMenuHandler={() =>
                    dispatch(closeShowDetailsUsersDrawer())
                  }
                >
                  <UserDetailsDrawer
                    dataId={dataId}
                    closeDrawerHandler={() =>
                      dispatch(closeShowDetailsUsersDrawer())
                    }
                  />
                </ClickMenu>
              )}
              {loading && (
                <div>
                  <Loading />
                </div>
              )}
              {!loading && filteredData.length === 0 && (
                <div className="flex items-center justify-center flex-col">
                  <FcDatabase color="red" size={80} />
                  <span className="mt-1 font-semibold text-2xl">No Data</span>
                </div>
              )}
              {!loading && filteredData.length > 0 && (
                <div>
                  <TableContainer>
                    <Table variant="simple" {...getTableProps()}>
                      <Thead className="text-lg font-semibold">
                        {headerGroups.map((hg) => {
                          return (
                            <Tr {...hg.getHeaderGroupProps()}>
                              {hg.headers.map((column) => {
                                return (
                                  <Th
                                    textTransform="capitalize"
                                    fontSize="15px"
                                    fontWeight="700"
                                    color="black"
                                    backgroundColor="#fafafa"
                                    borderLeft="1px solid #d7d7d7"
                                    borderRight="1px solid #d7d7d7"
                                    {...column.getHeaderProps(
                                      column.getSortByToggleProps()
                                    )}
                                  >
                                    <p className="flex">
                                      {column.render("Header")}
                                      {column.isSorted && (
                                        <span>
                                          {column.isSortedDesc ? (
                                            <FaCaretDown />
                                          ) : (
                                            <FaCaretUp />
                                          )}
                                        </span>
                                      )}
                                    </p>
                                  </Th>
                                );
                              })}
                              <Th
                                textTransform="capitalize"
                                fontSize="15px"
                                fontWeight="700"
                                color="black"
                                backgroundColor="#fafafa"
                                borderLeft="1px solid #d7d7d7"
                                borderRight="1px solid #d7d7d7"
                              >
                                Actions
                              </Th>
                            </Tr>
                          );
                        })}
                      </Thead>
                      <Tbody {...getTableBodyProps()}>
                        {page.map((row) => {
                          prepareRow(row);

                          return (
                            <Tr
                              className="relative hover:bg-[#e4e4e4] hover:cursor-pointer text-base lg:text-base"
                              {...row.getRowProps()}
                            >
                              {row.cells.map((cell) => {
                                return (
                                  <Td fontWeight="600" {...cell.getCellProps()}>
                                    {cell.column.id !== "account_name" &&
                                      cell.column.id !== "account_status" &&
                                      cell.column.id !== "created_on" &&
                                      cell.render("Cell")}
                                    {cell.column.id === "customertype" &&
                                      (cell.row.original.customertype ===
                                      "People" ? (
                                        <span className="text-sm bg-[#fff0f6] text-[#c41d7f] rounded-md px-3 py-1">
                                          Individual
                                        </span>
                                      ) : (
                                        <span className="text-sm bg-[#e6f4ff] text-[#0958d9] rounded-md px-3 py-1">
                                          Corporate
                                        </span>
                                      ))}
                                    {cell.column.id === "created_on" &&
                                      row.original?.createdAt && (
                                        <span>
                                          {moment(
                                            row.original?.createdAt
                                          ).format("DD/MM/YYYY")}
                                        </span>
                                      )}
                                    {cell.column.id === "account_status" && (
                                      <span
                                        className={`text-sm rounded-md px-3 py-1`}
                                        style={{
                                          backgroundColor: `${
                                            statusStyles[
                                              row.original?.account?.account_status?.toLowerCase()
                                            ]?.bg
                                          }`,

                                          color: `${
                                            statusStyles[
                                              row.original?.account?.account_status?.toLowerCase()
                                            ]?.text
                                          }`,
                                        }}
                                      >
                                        {
                                          row.original?.account
                                            ?.account_status
                                        }
                                      </span>
                                    )}
                                    {cell.column.id === "account_name" && (
                                      <span>
                                        {
                                          row.original?.account
                                            ?.account_name
                                        }
                                      </span>
                                    )}

                                    {cell.column.id === "company" && (
                                      <span>
                                        {row.original?.company}
                                      </span>
                                    )}

                                    {cell.column.id === "city" && (
                                      <span>
                                        {row.original?.city}
                                      </span>
                                    )}

                                    {cell.column.id === "employeeCount" && (
                                      <span>
                                        {
                                          row.original
                                            ?.employeeCount
                                        }
                                      </span>
                                    )}
                                  </Td>
                                );
                              })}
                              <Td className="flex gap-x-2">
                                <MdOutlineVisibility
                                  className="hover:scale-110"
                                  size={20}
                                  onClick={() =>
                                    showDetailsHandler(row.original?._id)
                                  }
                                />
                              </Td>
                            </Tr>
                          );
                        })}
                      </Tbody>
                    </Table>
                  </TableContainer>

                  <div className="w-[max-content] m-auto my-7">
                    <button
                      className="text-sm mt-2 bg-[#1640d6] py-1 px-4 text-white border-[1px] border-[#1640d6] rounded-3xl disabled:bg-[#b2b2b2] disabled:border-[#b2b2b2] disabled:cursor-not-allowed md:text-lg md:py-1 md:px-4 lg:text-xl lg:py-1 xl:text-base"
                      disabled={!canPreviousPage}
                      onClick={previousPage}
                    >
                      Prev
                    </button>
                    <span className="mx-3 text-sm md:text-lg lg:text-xl xl:text-base">
                      {pageIndex + 1} of {pageCount}
                    </span>
                    <button
                      className="text-sm mt-2 bg-[#1640d6] py-1 px-4 text-white border-[1px] border-[#1640d6] rounded-3xl disabled:bg-[#b2b2b2] disabled:border-[#b2b2b2] disabled:cursor-not-allowed md:text-lg md:py-1 md:px-4 lg:text-xl lg:py-1 xl:text-base"
                      disabled={!canNextPage}
                      onClick={nextPage}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Users;
