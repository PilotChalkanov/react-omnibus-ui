import JenkinsIcon from "../assets/icons/jenkins.svg";
import MavenIcon from "../assets/icons/maven.svg";
import KubernetesIcon from "../assets/icons/kubernetes.svg";
import NuGetIcon from "../assets/icons/nuget.svg";
import JiraIcon from "../assets/icons/jira.svg";
import GitIcon from "../assets/icons/git.svg";
import PowerBiIcon from "../assets/icons/power-bi.svg";
import ConnectionIcon from "../assets/icons/generic-connection.svg";
import PythonIcon from "../assets/icons/python.svg";
import SshIcon from "../assets/icons/ssh.svg";

export const sampleServices = [
  {
    serviceName: "Jenkins",
    icon: JenkinsIcon,
    id: 11,
    serviceUrl: "https://www.jenkins.io/",
  },
  {
    serviceName: "Jira",
    icon: JiraIcon,
    id: 12,
    serviceUrl: "https://www.atlassian.com/software/jira",
  },
  {
    serviceName: "Kubernetes",
    icon: KubernetesIcon,
    id: 13,
    serviceUrl: "https://kubernetes.io/",
  },
  {
    serviceName: "Maven",
    icon: MavenIcon,
    id: 14,
    serviceUrl: "https://maven.apache.org/",
  },
  {
    serviceName: "NuGet",
    icon: NuGetIcon,
    id: 15,
    serviceUrl: "https://www.nuget.org/",
  },
  {
    serviceName: "Other Git",
    icon: GitIcon,
    id: 16,
    serviceUrl: "https://git-scm.com/",
  },
  {
    serviceName: "Power BI",
    icon: PowerBiIcon,
    id: 17,
    serviceUrl: "https://powerbi.microsoft.com/",
  },
  {
    serviceName: "Python package download",
    icon: PythonIcon,
    id: 18,
    serviceUrl: "https://pypi.org/",
  },
  {
    serviceName: "Python package upload",
    icon: PythonIcon,
    id: 19,
    serviceUrl: "https://upload.pypi.org/",
  },
  {
    serviceName: "SSH",
    icon: SshIcon,
    id: 20,
    serviceUrl: "https://www.ssh.com/",
  },
  {
    serviceName: "Sample Connection",
    icon: ConnectionIcon,
    id: 21,
    serviceUrl: "http://example.com",
  },
];
