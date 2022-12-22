import { regular, solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import cx from "classnames";
import React, { useState, useEffect } from "react";
import toast, { LoaderIcon, Toaster } from "react-hot-toast";
import {
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useNavigation,
  useParams,
} from "react-router-dom";
import Button from "../../components/atom/button";
import { LoadingSpinner } from "../../components/atom/spinner";
import { ListView } from "../../components/compound/list-view";
import CustomDropDown from "../../components/custom_dropdown";
import FIcon from "../../components/ficon";
import { SlideModal } from "../../components/molecule/slide-modal";
import { AppRoutes } from "../../helper/app-routes";
import { Fold, ExtractPath } from "../../helper/typescript-utils";

import { useAppService } from "../../hooks/use-app-service";
import useAuth from "../../hooks/use-auth";
import useSearchPath from "../../hooks/use-search-path-hook";
import { NavbarLayout } from "../layout";
import Nav from "../task/component/nav";
import WorkspaceContentView from "./layout/workspace-content-view";
import ProjectView from "./pages/project-view";

function WorkSpacePage() {
  const [organization, setOrganization] = useState();
  const [projects, setProjects] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { organizationService } = useAppService();
  const { user } = useAuth();
  const [active, setActive] = useState(false);

  const params = useParams();
  const { projectService } = useAppService();

  const map = useSearchPath(["workspace", "projects"]);
  const navigation = useNavigate();

  // Current organization slug
  const orgSlug = map.workspace;

  const projectSlug = map.projects;

  // Get all organizations for current user
  useEffect(() => {
    if (!user || !orgSlug) return;
    console.log("Getting orgs");
    setIsLoading(true);
    organizationService
      .getOrganizationBySlug(orgSlug)
      .then(({ organization }) => {
        setOrganization(organization);
      })
      .catch((err) => {
        console.log(err);

        toast.error("Failed to load organizations");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [orgSlug, user]);

  // Get projects for current organization
  useEffect(() => {
    if (!orgSlug || !user) {
      return;
    }
    console.log("Getting projects", orgSlug);
    setIsLoading(true);
    projectService
      .getAllProjectsBySlug(orgSlug)
      .then(({ Projects }) => {
        if (Projects.length != 0) {
          setProjects(Projects);
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [orgSlug, user]);

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          Loading...
        </div>
      ) : (
        <div className="h-full flex flex-col">
          <NavbarLayout>
            <div className="flex items-center gap-5 w-full">
              <button
                onClick={() => {
                  setActive(true);
                }}
              >
                <FIcon icon={solid("bars")} className="text-slate-500" />
              </button>
              <Nav />
            </div>
          </NavbarLayout>
          <WorkspaceSidePanel
            active={active}
            setActive={setActive}
            projects={projects}
            activeWorkspace={organization}
            orgId={orgSlug}
          />

          <Fold
            value={projects}
            ifPresent={(list) => (
              <>
                <ProjectView displayProject={!projectSlug && list[0]} />
              </>
            )}
            ifAbsent={(list) => <EmptyProjectsView />}
          />
        </div>
      )}
    </>
  );

  function EmptyProjectsView() {
    return (
      <div className="flex-1">
        <div className="h-full flex flex-col gap-4 w-full items-center place-content-center max-w-xl mx-auto text-center">
          <h1 className="text-3xl">Create a project</h1>
          <span className="text-slate-500 text-sm">
            Projects are where you
            <span className="font-medium mx-2 text-slate-700">
              organize your work.
            </span>
            You can create projects for different teams, clients, or even for
            yourself. For example, an{" "}
            <span className="font-medium mx-2 text-slate-700">engineering</span>
            project could contains all engineering-related tasks.
          </span>
          <div className="border rounded-full border-teal-400">
            <Button
              label="Create Project"
              type="outline"
              className="rounded-full"
              size="small"
            />
          </div>
        </div>
      </div>
    );
  }
}

function WorkspaceSidePanel({
  setActive,
  active,
  activeWorkspace,
  projects,
  orgId,
}) {
  const navigate = useNavigate();

  return (
    <SlideModal
      width="320px"
      setActive={setActive}
      active={active}
      align="left"
    >
      <Fold
        value={activeWorkspace}
        ifPresent={(workspace) => (
          <div className="Layout bg-white w-full h-full">
            {/* Workspace Settings and Toggle */}
            <div className="flex justify-between items-center p-4">
              <CustomDropDown
                className="z-10"
                button={
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-900 flex-1">
                    <span>{workspace.name}</span>
                    <FIcon icon={solid("angle-down")} />
                  </div>
                }
              >
                <div className="relative">
                  <div className="absolute -right-20 flex flex-col p-2 gap-[2px] rounded bg-white text-sm shadow-lg border">
                    <p className="text-slate-400 py-2 w-64 ">
                      My Awesome Workspace
                    </p>
                    <div className="flex flex-col gap-1">
                      <div className="px-2 py-3 rounded hover:bg-gray-100 cursor-pointer">
                        Team Settings
                      </div>
                      <div
                        className="px-2 py-3 rounded hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          navigate(AppRoutes.users.myOrganization);
                        }}
                      >
                        Switch and manage workspaces
                      </div>
                    </div>
                  </div>
                </div>
              </CustomDropDown>

              {/* Close this panel */}
              <button onClick={() => setActive(false)}>
                <FIcon icon={solid("angles-left")} className="text-slate-500" />
              </button>
            </div>

            {/* CREATE PROJECT */}

            <div className="flex gap-2 px-3 items-center mt-3">
              <p className="flex-1 text-[13px] text-slate-400">PROJECTS</p>
              <Button
                label="create Project"
                type="link"
                size="small"
                leadingIcon={
                  <FIcon icon={solid("plus")} className="text-teal-500" />
                }
              />
            </div>

            <Fold
              value={projects}
              ifPresent={(list) => (
                <ListView
                  items={list}
                  renderItem={(project) => (
                    <NavLink
                      to={`/workspace/${orgId}/projects/${project.meta.slug}`}
                      // className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer transition-all ease-in duration-200"
                      className={(data) =>
                        cx(
                          " group flex items-center space-x-2 px-2  lg:mx-2 py-3 text-sm font-medium rounded-md ",
                          "transition-all ease-in duration-200",
                          {
                            "bg-gray-100 text-slate-700 border-l-4 rounded-l border-red-500":
                              data.isActive,
                            "text-gray-600 hover:bg-gray-50 hover:text-gray-900":
                              !data.isActive,
                          }
                        )
                      }
                      onClick={() => {
                        setActive(false);
                      }}
                    >
                      <FIcon
                        icon={regular("circle")}
                        className="text-slate-500 scale-75 z-0"
                        size="1x"
                      />
                      <p className="text-sm font-medium text-gray-900">
                        {project.name}
                      </p>
                    </NavLink>
                  )}
                  noItemsElement={
                    <div className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer">
                      <FIcon
                        icon={solid("folder")}
                        className="text-slate-500"
                      />
                      <p className="text-sm font-medium text-gray-900">
                        Create a workspace to get started
                      </p>
                    </div>
                  }
                />
              )}
              ifAbsent={() => (
                <div className="px-3 py-2 bg-gray-100 hover:bg-gray-100  m-3 ">
                  <span className="text-sm text-slate-600">
                    Create a workspace to get started
                  </span>
                </div>
              )}
            />
          </div>
        )}
        ifAbsent={() => (
          <div className=" px-3 py-2 bg-gray-100 hover:bg-gray-100  m-3 h-full flex flex-col items-center place-content-center">
            <LoadingSpinner />
          </div>
        )}
      />
    </SlideModal>
  );
}

export default WorkSpacePage;
