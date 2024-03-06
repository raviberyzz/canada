package ca.sunlife.web.cms.core.configurations;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "CDCP Workflow Configuration")
public @interface CDCPWorkflowConfig {

    @AttributeDefinition(name = "CDCP PDF files location", description = "If left empty the workflow will exit")
    String cdcpPDFLocation();

    @AttributeDefinition(name = "CDCP JSON file location", description = "If left empty the workflow will exit")
    String cdcpJSONLocation();

}
