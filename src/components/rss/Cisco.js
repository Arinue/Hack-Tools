import React from "react";
import { Typography, Empty, Spin, Button, List, PageHeader, Tag } from "antd";
import QueueAnim from "rc-queue-anim";
import { goTo } from "react-chrome-extension-router";
import { useQuery } from "react-query";
import FeedRSS from "../FeedRSS";

const { Title } = Typography;

const fetchApi = async () => {
  const res = await fetch(
    "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Ftools.cisco.com%2Fsecurity%2Fcenter%2Fpsirtrss20%2FCiscoSecurityAdvisory.xml&api_key=spbf63tt7rvx2r0wh2x6yoz00ssjyztpceqqkdj3&count=20"
  );
  return res.json();
};

export default (props) => {
  const { data, status, error } = useQuery("cisco", fetchApi);

  return (
    <QueueAnim delay={300} duration={1500}>
      <PageHeader
        onBack={() => goTo(FeedRSS)}
        title='Feed RSS'
        subTitle='Cisco Security Advisories'
        extra={[
          <Button key='1' type='primary'>
            <a
              href='https://tools.cisco.com/security/center/publicationListing.x'
              rel='noreferrer noopener'
              target='_blank'
            >
              Visit orignal website
            </a>
          </Button>,
        ]}
      />
      {status === "loading" && (
        <div style={{ textAlign: "center" }}>
          <Spin />
          <Empty />
        </div>
      )}
      {status === "error" && (
        <>
          <Empty
            image='https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg'
            imageStyle={{
              height: 60,
            }}
            description={<span>Error getting the data please contact us.</span>}
          >
            <pre>{error.message}</pre>
            <Button danger>
              <a
                href='https://github.com/LasCC/Hack-Tools/issues'
                rel='noreferrer noopener'
                target='_blank'
              >
                Report the bug
              </a>
            </Button>
          </Empty>
        </>
      )}
      {status === "success" && (
        <div
          key='a'
          style={{
            padding: 15,
          }}
        >
          <Title
            variant='Title level={4}'
            style={{
              fontWeight: "bold",
              marginTop: 15,
            }}
          >
            Recent exploit
          </Title>
          <List
            itemLayout='horizontal'
            dataSource={data.items}
            style={{ marginTop: 15 }}
            renderItem={(list) => (
              <List.Item
                actions={[
                  <div>
                    {(() => {
                      const severityLevel = list.content.match(
                        /(  )[a-zA-Z]+/
                      )[0];
                      console.log(severityLevel);
                      switch (severityLevel) {
                        case "  Critical":
                          return <Tag color='red'>{severityLevel}</Tag>;
                        case "  High":
                          return <Tag color='magenta'>{severityLevel}</Tag>;
                        case "  Medium":
                          return <Tag color='orange'>{severityLevel}</Tag>;
                        case "  Low":
                          return <Tag color='lime'>{severityLevel}</Tag>;
                        case "  Informational":
                          return <Tag color='blue'>{severityLevel}</Tag>;
                        default:
                          break;
                      }
                    })()}
                  </div>,
                  <Tag color='geekblue' style={{ marginLeft: 5 }}>
                    {list.content.match(/CVE-(\d{4})-(\d{4,5})/)[0]}
                  </Tag>,
                ]}
              >
                <a
                  href={list.link}
                  alt='exploit_db_link'
                  target='_blank'
                  rel='noreferrer noopener'
                >
                  {list.title}
                </a>
              </List.Item>
            )}
          />
        </div>
      )}
    </QueueAnim>
  );
};
