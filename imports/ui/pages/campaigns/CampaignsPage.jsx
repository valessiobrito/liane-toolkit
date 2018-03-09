import React from "react";
import PageHeader from "/imports/ui/components/app/PageHeader.jsx";
import Loading from "/imports/ui/components/utils/Loading.jsx";
import Alerts from "/imports/ui/utils/Alerts.js";
import SelectFacebookAccount from "/imports/ui/components/facebook/SelectFacebookAccount.jsx";

import { Grid, Header, List, Button } from "semantic-ui-react";

import moment from "moment";

export default class CampaignsPage extends React.Component {
  constructor(props) {
    super(props);
    console.log("CampaignPage init", { props });
    this.state = {
      facebookId: props.facebookId
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.facebookId != this.props.facebookId) {
      this.setState({ facebookId: nextProps.facebookId });
    }
  }

  render() {
    const { loading, campaign } = this.props;
    const { accounts } = campaign;
    const { facebookId } = this.state;
    const facebookAccount = !loading
      ? _.findWhere(accounts, { facebookId: facebookId })
      : null;
    return (
      <div>
        <PageHeader
          title={`Campaign: ${campaign ? campaign.name : ""}`}
          titleTo={FlowRouter.path("App.campaignDetail", {
            campaignId: campaign ? campaign._id : ""
          })}
          subTitle={!loading && facebookId ? facebookAccount.name : ""}
        />
        <section className="content">
          {loading ? (
            <Loading />
          ) : (
            <Grid>
              <Grid.Row columns={2}>
                <Grid.Column>
                  <Header as="h3">Campaign Accounts</Header>
                  {accounts.length ? (
                    <List verticalAlign="middle">
                      {accounts.map(account => {
                        return (
                          <List.Item key={account._id}>
                            <List.Icon name="facebook square" />
                            <List.Content>
                              <List.Header>{account.name}</List.Header>
                              {account.category}
                            </List.Content>
                          </List.Item>
                        );
                      })}
                    </List>
                  ) : (
                    "You do not have associated accounts for this campaign"
                  )}
                </Grid.Column>
                <Grid.Column>
                  <SelectFacebookAccount
                    campaignId={campaign._id}
                    selectedAccountsIds={_.pluck(accounts, "facebookId")}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          )}
        </section>
      </div>
    );
  }
}
