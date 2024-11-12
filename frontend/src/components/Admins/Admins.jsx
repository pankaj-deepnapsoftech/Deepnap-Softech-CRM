import { Button, useDisclosure } from "@chakra-ui/react";
import {
  MdOutlineRefresh,
  MdArrowBack,
  MdEdit,
  MdDeleteOutline,
  MdOutlineVisibility,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  closeAddCompaniesDrawer,
  closeEditAdminsDrawer,
  closeEditCompaniesDrawer,
  closeShowDetailsAdminsDrawer,
  openAddCompaniesDrawer,
  openEditAdminsDrawer,
  openShowDetailsAdminsDrawer,
} from "../../redux/reducers/misc";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import Loading from "../ui/Loading";
import { FcDatabase } from "react-icons/fc";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

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
import CompaniesEditDrawer from "../ui/Drawers/Edit Drawers/CompaniesEditDrawer";
import CompaniesDrawer from "../ui/Drawers/Add Drawers/CompaniesDrawer";
import AdminsDetailsDrawer from "../ui/Drawers/Details Drawers/AdminsDetailsDrawer";
import AdminsEditDrawer from "../ui/Drawers/Edit Drawers/AdminsEditDrawer";
import AdminDeleteAlert from "../ui/AdminDeleteAlert";

const columns = [
  {
    Header: "Designation",
    accessor: "designation",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Phone",
    accessor: "phone",
  }
];

const Admins = () => {
  const [cookies] = useCookies();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [dataId, setDataId] = useState();
  const [loading, setLoading] = useState(true);
  const [searchKey, setSearchKey] = useState("");

  const [deleteEmployeeSelectedId, setDeleteEmployeeSelectedId] = useState();


  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef()





  const dispatch = useDispatch();
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

  const {
    editAdminsDrawerIsOpened,
    showDetailsAdminsDrawerIsOpened
  } = useSelector((state) => state.misc);

  const baseURL = process.env.REACT_APP_BACKEND_URL;

  const fetchDetails = () => {};

  const fetchAllAdmins = async () => {
    setData([]);
    setFilteredData([]);
    setLoading(true);
    try {
      const response = await fetch(baseURL + "admin/all-admins", {
        method: "GET",
        headers: {
          authorization: `Bearer ${cookies?.access_token}`,
        },
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message);
      }

      setData(data.admins);
      setFilteredData(data.admins);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error(err.message);
    }
  };

  const addCompaniesHandler = () => {
    dispatch(openAddCompaniesDrawer());
  };

  const editHandler = (id) => {
    setDataId(id);
    dispatch(openEditAdminsDrawer());
  };

  const showDetailsHandler = (id) => {
    setDataId(id);
    dispatch(openShowDetailsAdminsDrawer());
  };

  useEffect(() => {
    fetchAllAdmins();
  }, []);

  useEffect(() => {
    if (searchKey.trim() !== "") {
      const searchedData = data.filter(
        (d) =>
          d?.name?.toLowerCase().includes(searchKey.toLowerCase()) ||
          d?.phone?.includes(searchKey) ||
          d?.email?.toLowerCase().includes(searchKey.toLowerCase())
      );
      setFilteredData(searchedData);
    } else {
      setFilteredData(data);
    }
  }, [searchKey]);

  return (
    <>
    <AdminDeleteAlert fetchAllAdmins={fetchAllAdmins} deleteEmployeeSelectedId={deleteEmployeeSelectedId} isOpen={isOpen} onOpen={onOpen} onClose={onClose} cancelRef={cancelRef} />

      {(role !== 'Super Admin' && !allowedroutes.includes("admin")) && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-bold text-[#ff6f6f]">
          You do not have access to this route. Contact your Super Admin
          for further action.
        </div>
      )}

      {(role === 'Super Admin' || allowedroutes.includes("admin")) && (
        <div
          className="border-[1px] px-2 py-8 md:px-9 rounded"
          style={{ boxShadow: "0 0 20px 3px #96beee26" }}
        >
          <div>
            <div className="flex flex-col items-start justify-start md:flex-row gap-y-1 md:justify-between md:items-center mb-8">
              <div className="flex text-lg md:text-xl font-semibold items-center gap-y-1">
                {/* <span className="mr-2">
                  <MdArrowBack />
                </span> */}
                Employee List
              </div>

              <div className="mt-2 md:mt-0 flex flex-wrap gap-y-1 gap-x-2 w-full md:w-fit">
                <textarea
                  className="rounded-[10px] w-full md:flex-1 px-2 py-2 md:px-3 md:py-2 text-sm focus:outline-[#1640d6] hover:outline:[#1640d6] border resize-none"
                  rows="1"
                  placeholder="Search"
                  value={searchKey}
                  onChange={(e) => setSearchKey(e.target.value)}
                />
                <Button
                  fontSize={{ base: "14px", md: "14px"}}
                  paddingX={{ base: "10px", md: "12px"}}
                  paddingY={{ base: "0", md: "3px" }}
                  width={{base: '-webkit-fill-available', md: 100}}
                  onClick={fetchAllAdmins}
                  leftIcon={<MdOutlineRefresh />}
                  color="#1640d6"
                  borderColor="#1640d6"
                  variant="outline"
                >
                  Refresh
                </Button>
                {/* <Button
                  onClick={addCompaniesHandler}
                  color="white"
                  backgroundColor="#1640d6"
                >
                  Add New Corporate
                </Button> */}
              </div>
            </div>

            <div>
              {editAdminsDrawerIsOpened && (
                <ClickMenu
                  top={0}
                  right={0}
                  closeContextMenuHandler={() =>
                    dispatch(closeEditAdminsDrawer())
                  }
                >
                  <AdminsEditDrawer
                    fetchAllAdmins={fetchAllAdmins}
                    dataId={dataId}
                    closeDrawerHandler={() => {
                      dispatch(closeEditAdminsDrawer());
                      fetchAllAdmins();
                    }}
                  />
                </ClickMenu>
              )}

              {showDetailsAdminsDrawerIsOpened && (
                <ClickMenu
                  top={0}
                  right={0}
                  closeContextMenuHandler={() =>
                    dispatch(closeShowDetailsAdminsDrawer())
                  }
                >
                  <AdminsDetailsDrawer
                    dataId={dataId}
                    closeDrawerHandler={() =>
                      dispatch(closeShowDetailsAdminsDrawer())
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
                                    {cell.render("Cell")}
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
                                <MdEdit
                                  className="hover:scale-110"
                                  size={20}
                                  onClick={() => editHandler(row.original?._id)}
                                />
                                <MdDeleteOutline
                                  className="hover:scale-110"
                                  size={20}
                                  onClick={() =>{
                                    onOpen();
                                    setDeleteEmployeeSelectedId(row.original?._id);
                                  }}
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

export default Admins;
