package ca.sunlife.web.cms.core.workflow;

import ca.sunlife.web.cms.core.configurations.CDCPWorkflowConfig;
import ca.sunlife.web.cms.core.constants.ProvinceMapping;
import com.adobe.aem.formsndocuments.util.FMConstants;
import com.day.cq.dam.api.Asset;
import com.day.cq.dam.api.AssetManager;
import com.day.cq.dam.api.DamConstants;
import com.day.cq.search.PredicateGroup;
import com.adobe.granite.workflow.WorkflowException;
import com.adobe.granite.workflow.WorkflowSession;
import com.adobe.granite.workflow.exec.WorkItem;
import com.adobe.granite.workflow.exec.WorkflowProcess;
import com.adobe.granite.workflow.metadata.MetaDataMap;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;

import org.apache.sling.api.resource.*;
import org.json.JSONArray;
import org.json.JSONObject;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Modified;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.metatype.annotations.Designate;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.*;

/**
 * Workflow for generating the CDCP JSON from the list of PDF's
 */
@Component(service = WorkflowProcess.class,
		immediate = true,
		property = {
				"process.label = CDCP JSON file creation step", Constants.SERVICE_DESCRIPTION + "="
				+ "Sunlife CDCP Workflow step - To generate JSON from PDF files in the DAM " +
				" and store them."
		})
@Designate(ocd = CDCPWorkflowConfig.class)
public class CDCPWorkflowStep implements WorkflowProcess {

	private static final Logger log = LoggerFactory.getLogger(CDCPWorkflowStep.class);
    @Reference
	private ResourceResolverFactory resolverFactory;

	private ProvinceMapping provinceMapping;

	private static final String CDCP_YEAR = "dam:cdcp-year";

	private static final String CDCP_PROVINCE = "dam:cdcp-province";

	private static final String CDCP_JSON_FILENAME_EN = "pdf-table-en.json";

	private static final String CDCP_JSON_FILENAME_FR = "pdf-table-fr.json";

	private static final String CDCP_SERVICE = "cdcp-service";

	private static CDCPWorkflowConfig config;

	@Override
	public void execute(WorkItem workItem, WorkflowSession wfSession, MetaDataMap metaData) throws WorkflowException {

		log.info("Starting workflow step CDCP Workflow Step");


		try {
			//Get access to the repository
			ResourceResolver resourceResolver = this.getResourceResolver();
			AssetManager assetManager = resourceResolver.adaptTo(AssetManager.class);

			//Create the querybuilder map
			Map<String, String> qm = new HashMap<String, String>();
			qm.put("path", config.cdcpPDFLocation());
			qm.put("type", FMConstants.DAM_ASSET_NODETYPE);
			qm.put("p.limit", "-1");

			QueryBuilder queryBuilder = resourceResolver.adaptTo(QueryBuilder.class);
			Session session = resourceResolver.adaptTo(Session.class);
			JSONArray jsonArrayEn = new JSONArray();
			JSONArray jsonArrayFr = new JSONArray();


			//Check if folder configured exists, stop execution if it does not
			Resource cdcpAppResource = resourceResolver.getResource(config.cdcpJSONLocation());
			if(cdcpAppResource == null){
				throw new RuntimeException("Parent folder does not exist: " + config.cdcpJSONLocation());
			}

			//Fail if access cannot be obtained for Querybuilder or session
			if (queryBuilder == null || session == null) {
				log.warn("Cannot execute query : QB or Session is null");
				return;
			}

			//Execute the query
			Query query = queryBuilder.createQuery(PredicateGroup.create(qm), session);
			SearchResult cdcpResult = query.getResult();


			//Iterate through the query results
			for (Hit hit : cdcpResult.getHits()) {
				Asset asset = resourceResolver.getResource(hit.getPath()).adaptTo(Asset.class);

				//Continue the loop if either of the below props are not available for the asset
				if(asset.getMetadataValue(CDCP_PROVINCE) == null || asset.getMetadataValue(CDCP_YEAR) == null){
					continue;
				}

				JSONObject jsonObjectEn = new JSONObject();
				JSONObject jsonObjectFr = new JSONObject();
				//Check for pdf's that end with -e and -f to differentiate between english and french
				if(asset.getName().endsWith("-e.pdf")){
					jsonObjectEn.put("name", asset.getName());
					jsonObjectEn.put("title",asset.getMetadataValue(DamConstants.DC_TITLE));
					jsonObjectEn.put("province",asset.getMetadataValue(CDCP_PROVINCE));
					jsonObjectEn.put("year", asset.getMetadataValue(CDCP_YEAR));
					jsonArrayEn.put(jsonObjectEn);
				}
				else if(asset.getName().endsWith("-f.pdf")){
					jsonObjectFr.put("name", asset.getName());
					jsonObjectFr.put("title",asset.getMetadataValue(DamConstants.DC_TITLE));
					jsonObjectFr.put("province",provinceMapping.getFrenchNameFromEnglish(asset.getMetadataValue(CDCP_PROVINCE)));
					jsonObjectFr.put("year", asset.getMetadataValue(CDCP_YEAR));
					jsonArrayFr.put(jsonObjectFr);
				}
			}

			//Convert jsonArray to String and format it
			InputStream jsonStreamEn = new ByteArrayInputStream(jsonArrayEn.toString(4).getBytes());
			InputStream jsonStreamFr = new ByteArrayInputStream(jsonArrayFr.toString(4).getBytes());

			//Write both files to the DAM
			Asset assetEn = assetManager.createAsset(config.cdcpJSONLocation() + "/" + CDCP_JSON_FILENAME_EN, jsonStreamEn, "application/json", true);
			Asset assetFr = assetManager.createAsset(config.cdcpJSONLocation() + "/" + CDCP_JSON_FILENAME_FR, jsonStreamFr, "application/json", true);

			//Commit changes and close the resolver
			resourceResolver.commit();
			resourceResolver.close();


		}catch(RepositoryException e){
			log.error("Repository Exception : {}", e.getMessage());
		} catch (Exception e){
			log.error("Exception: {}", e.getMessage());
		}

	}

    //Access to repo using service user
	private ResourceResolver getResourceResolver() throws LoginException {
		return resolverFactory.getServiceResourceResolver(
				Collections.singletonMap(ResourceResolverFactory.SUBSERVICE, CDCP_SERVICE));
	}

	//Activate the config class
	@Modified
	@Activate
	protected void activate(CDCPWorkflowConfig config){
		if(config != null){
			this.config = config;
		}
	}

}
